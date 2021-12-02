import React, { useEffect, useReducer } from 'react';
import s from './MapPage.module.scss';
import { MapContainer, TileLayer } from 'react-leaflet';
import classNames from 'classnames';
import { Addresses } from '../../constants/Addresses';
import { MapMarker } from '../../components/Marker/MapMarker';
import {
  SET_CONTAINERS_INFO,
  trashReducer,
} from '../../reducers/trash.reducer';
import { trashApi } from '../../api/trash.api';
import { useFetching } from '../../hook/useFething';

export const MapPage = () => {
  const [state, dispatch] = useReducer(trashReducer, {
    garagePosition: null,
    containersInfo: [],
  });

  const [fetchTrashContainersInfo, isLoadingTrashContainers] = useFetching(
    async () => {
      const containers = await trashApi.getTrashContainers();
      dispatch({ type: SET_CONTAINERS_INFO, payload: containers });
    }
  );

  useEffect(() => {
    trashApi.getGarage().then((position) => {
      dispatch({ type: SET_CONTAINERS_INFO, payload: position });
    });
  }, [dispatch]);

  useEffect(() => {
    fetchTrashContainersInfo();
  }, []);

  return (
    <div className={classNames(s.wrapper)}>
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
        {!isLoadingTrashContainers &&
          state.containersInfo.map((a, i) => (
            <MapMarker containerInfo={a} key={`${a.text}_${i}`} />
          ))}
      </MapContainer>
    </div>
  );
};
