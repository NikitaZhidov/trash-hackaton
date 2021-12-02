import React from 'react';
import s from './MapPage.module.scss';
import { MapContainer, TileLayer } from 'react-leaflet';
import classNames from 'classnames';
import { Addresses } from '../../constants/Addresses';
import { MapMarker } from '../../components/Marker/MapMarker';

export const MapPage = () => {
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
        {Addresses.map((a, i) => (
          <MapMarker addressTrashInfo={a} key={`${a.text}_${i}`} />
        ))}
      </MapContainer>
    </div>
  );
};
