import React from 'react';
import s from './MapMarker.module.scss';
import { Marker, Popup } from 'react-leaflet';
import {
  trashDivIconFilled,
  trashDivIconNotFilled,
} from '../../pages/MapPage/icons/TrashDivIcon';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AppRoutes } from '../../constants/AppRoutes';

export const isCriticalFilling = (totalAmount, filled) => {
  const criticalPart = 0.5;
  return filled / totalAmount > criticalPart;
};

export const MapMarker = ({ containerInfo }) => {
  return (
    <>
      <Marker
        icon={
          isCriticalFilling(containerInfo.cnt_bins, containerInfo.full_bins)
            ? trashDivIconFilled
            : trashDivIconNotFilled
        }
        position={containerInfo.address.position}
      >
        <Popup>
          <div className={s.popupRow}>
            {containerInfo.address.id}#: {containerInfo.address.address}
          </div>
          <div className={s.popupRow}>
            <img
              src={`${containerInfo.imgSrc}`}
              className={s.trashImg}
              alt={containerInfo.text}
            />
          </div>
          <div className={s.popupRow}>Заполнено: {containerInfo.full_bins}</div>
          <div className={s.popupRow}>Всего: {containerInfo.cnt_bins}</div>
          <div className={s.popupRow}>
            Дата последней проверки:{' '}
            {new Date(Math.ceil(containerInfo.time) * 1000).toLocaleString()}
          </div>
          <div className={s.popupRow}>
            <Link
              to={AppRoutes.GetRoutToTrashContainer(containerInfo.address.id)}
            >
              <Button variant="success">Подробнее</Button>
            </Link>
          </div>
        </Popup>
      </Marker>
    </>
  );
};
