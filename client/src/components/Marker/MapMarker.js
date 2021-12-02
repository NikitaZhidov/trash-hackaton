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

export const MapMarker = ({ addressTrashInfo }) => {
  return (
    <>
      <Marker
        icon={
          addressTrashInfo.isFill ? trashDivIconFilled : trashDivIconNotFilled
        }
        position={addressTrashInfo.position}
      >
        <Popup>
          <div className={s.popupRow}>
            {addressTrashInfo.id}#: {addressTrashInfo.text}
          </div>
          <div className={s.popupRow}>
            <img
              src={addressTrashInfo.trashImg}
              className={s.trashImg}
              alt={addressTrashInfo.text}
            />
          </div>
          <div className={s.popupRow}>
            Заполнен: {addressTrashInfo.isFill ? 'Да' : 'Нет'}
          </div>
          <div className={s.popupRow}>
            Дата последней проверки: {addressTrashInfo.date.toLocaleString()}
          </div>
          <div className={s.popupRow}>
            <Button variant="success">
              <Link to={AppRoutes.GetRoutToTrashContainer(addressTrashInfo.id)}>
                Подробнее
              </Link>
            </Button>
          </div>
        </Popup>
      </Marker>
    </>
  );
};
