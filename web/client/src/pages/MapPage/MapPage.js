import React, { useEffect, useReducer } from 'react';
import s from './MapPage.module.scss';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import classNames from 'classnames';
import {
  isCriticalFilling,
  MapMarker,
} from '../../components/Marker/MapMarker';
import {
  SET_CONTAINERS_INFO,
  SET_GARAGE_POSITION,
  SWITCH_SHOW_ONLY_FILLED,
  trashReducer,
} from '../../reducers/trash.reducer';
import { trashApi } from '../../api/trash.api';
import { useFetching } from '../../hook/useFething';
import { Form } from 'react-bootstrap';
import { SpinnerPreloader } from '../../components/ui/SpinnerPreloader';
import { GarageIcon } from './icons/GarageIcon';

export const MapPage = () => {
  const [state, dispatch] = useReducer(trashReducer, {
    garagePosition: null,
    containersInfo: [],
    showOnlyFilled: false,
  });

  const [fetchTrashContainersInfo, isLoadingTrashContainers] = useFetching(
    async () => {
      const containers = await trashApi.getTrashContainers();
      dispatch({ type: SET_CONTAINERS_INFO, payload: containers });
    }
  );

  useEffect(() => {
    trashApi.getGarage().then((position) => {
      dispatch({ type: SET_GARAGE_POSITION, payload: position });
    });
  }, [dispatch]);

  useEffect(() => {
    fetchTrashContainersInfo();
  }, []);

  return (
    <div className={classNames(s.wrapper)}>
      {isLoadingTrashContainers ? (
        <SpinnerPreloader />
      ) : (
        <>
          <div style={{ padding: '3px 15px' }}>
            <Form.Check
              value={state.showOnlyFilled}
              onChange={() => dispatch({ type: SWITCH_SHOW_ONLY_FILLED })}
              label="Требуют обслуживания"
            />
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
