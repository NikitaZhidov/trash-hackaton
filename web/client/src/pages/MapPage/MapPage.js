import React, { useEffect, useReducer } from 'react';
import s from './MapPage.module.scss';
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from 'react-leaflet';
import classNames from 'classnames';
import {
  isCriticalFilling,
  MapMarker,
} from '../../components/Marker/MapMarker';
import {
  SET_CONTAINERS_INFO,
  SET_GARAGE_POSITION,
  SET_SHORT_ROUTES,
  SWITCH_SHOW_ONLY_FILLED,
  SWITCH_SHOW_SHORT_ROUTES,
  trashReducer,
} from '../../reducers/trash.reducer';
import { trashApi } from '../../api/trash.api';
import { useFetching } from '../../hook/useFething';
import { Form } from 'react-bootstrap';
import { SpinnerPreloader } from '../../components/ui/SpinnerPreloader';
import { GarageIcon } from './icons/GarageIcon';

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const MapPage = () => {
  const [state, dispatch] = useReducer(trashReducer, {
    garagePosition: null,
    containersInfo: [],
    showOnlyFilled: false,
    shortRoutes: [],
    showShortRoutes: true,
  });

  const [fetchTrashContainersInfo, isLoadingTrashContainers] = useFetching(
    async () => {
      const containers = await trashApi.getTrashContainers();
      dispatch({ type: SET_CONTAINERS_INFO, payload: containers });
    }
  );

  const [fetchShortRoutes, isLoadingShortRoutes] = useFetching(async () => {
    const shortRoutes = await trashApi.getShortRoutes();
    dispatch({ type: SET_SHORT_ROUTES, payload: shortRoutes });
  });

  const [fetchGaragePosition, isLoadingGaragePosition] = useFetching(
    async () => {
      const garagePosition = await trashApi.getGarage();
      dispatch({ type: SET_GARAGE_POSITION, payload: garagePosition });
    }
  );

  useEffect(() => {
    fetchTrashContainersInfo();
    fetchShortRoutes();
    fetchGaragePosition();
  }, []);

  return (
    <div className={classNames(s.wrapper)}>
      {isLoadingTrashContainers ||
      isLoadingShortRoutes ||
      isLoadingGaragePosition ? (
        <SpinnerPreloader />
      ) : (
        <>
          <div style={{ padding: '3px 15px' }}>
            <div style={{ display: 'flex' }}>
              <Form.Check
                value={state.showOnlyFilled}
                checked={state.showOnlyFilled}
                onChange={() => dispatch({ type: SWITCH_SHOW_ONLY_FILLED })}
                style={{ marginRight: '20px' }}
                label="Требуют обслуживания"
              />
              <Form.Check
                value={state.showShortRoutes}
                checked={state.showShortRoutes}
                onChange={() => dispatch({ type: SWITCH_SHOW_SHORT_ROUTES })}
                label="Показать кратчайший маршрут"
              />
            </div>
          </div>
          <div
            style={{
              width: '100%',
              height: '95%',
              borderRadius: '15px',
              overflow: 'hidden',
            }}
          >
            <MapContainer
              center={[54.90249, 52.2897]}
              zoom={13}
              scrollWheelZoom={true}
              className={classNames(s.map)}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {state.showShortRoutes &&
                state.shortRoutes.map((sr) => {
                  return (
                    <Polyline
                      key={getRandomColor()}
                      positions={sr}
                      color={getRandomColor()}
                    />
                  );
                })}

              {state.garagePosition && (
                <Marker icon={GarageIcon} position={state.garagePosition}>
                  <Popup>Гараж</Popup>
                </Marker>
              )}

              {!isLoadingTrashContainers &&
                state.containersInfo.map((a, i) => {
                  if (
                    !state.showOnlyFilled ||
                    isCriticalFilling(a.cnt_bins, a.full_bins)
                  )
                    return (
                      <MapMarker containerInfo={a} key={`${a.text}_${i}`} />
                    );
                })}
            </MapContainer>
          </div>
        </>
      )}
    </div>
  );
};
