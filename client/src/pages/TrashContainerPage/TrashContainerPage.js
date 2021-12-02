import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Addresses } from '../../constants/Addresses';
import s from './TrashContainerPage.module.scss';

export const TrashContainerPage = () => {
  const { containerId } = useParams();
  const [addressTrashInfo, setAddressTrashInfo] = useState(null);

  useEffect(() => {
    const currentAddressTrashInfo = Addresses.find(
      (a) => a.id.toString() === containerId
    );
    console.log(containerId);
    setAddressTrashInfo(currentAddressTrashInfo);
  }, [containerId]);

  return (
    <div>
      {addressTrashInfo && (
        <div>
          <h1 className={s.title}>
            #{addressTrashInfo.id}: {addressTrashInfo.text}
          </h1>
          <div className={s.imgWrapper}>
            <img
              className={s.img}
              src={addressTrashInfo.trashImg}
              alt={addressTrashInfo.text}
            />
          </div>
          <div className={s.containerInfo}>
            Заполнен: {addressTrashInfo.isFill ? 'Да' : 'Нет'}
          </div>
          <div className={s.containerInfo}>
            Дата последней проверки: {addressTrashInfo.date.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};
