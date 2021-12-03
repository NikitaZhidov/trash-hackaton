import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { trashApi } from '../../api/trash.api';
import { useFetching } from '../../hook/useFething';
import { SpinnerPreloader } from '../../components/ui/SpinnerPreloader';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import s from './TrashContainerPage.module.scss';
import { FullScreenImg } from '../../components/ui/FullScreenImg';

export const TrashContainerPage = () => {
  const { containerId } = useParams();
  const [containerInfo, setTrashContainerInfo] = useState(null);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);

  const navigate = useNavigate();

  const onCloseFullScreenImage = () => {
    setShowFullScreenImage(false);
  };

  const [fetchTrashContainerInfo, isLoadingTrashContainerInfo] = useFetching(
    async (...args) => {
      const container = await trashApi.getTrashContainerById(...args);
      setTrashContainerInfo(container);
    }
  );

  useEffect(() => {
    fetchTrashContainerInfo(containerId);
  }, []);

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <Button onClick={() => navigate(-1)}>Назад</Button>
      {isLoadingTrashContainerInfo || !containerInfo ? (
        <SpinnerPreloader />
      ) : (
        <>
          <FullScreenImg
            show={showFullScreenImage}
            img={containerInfo.imgSrc}
            onClose={onCloseFullScreenImage}
          />
          <div className={s.infoWrapper}>
            <h1 className={s.title}>
              {containerInfo.address.id}#: {containerInfo.address.address}
            </h1>
            <div className={s.imgWrapper}>
              <img
                src={`${containerInfo.imgSrc}`}
                className={s.trashImg}
                alt={containerInfo.text}
                style={{ cursor: 'pointer' }}
                onClick={() => setShowFullScreenImage(true)}
              />
            </div>
            <div>
              <div className={s.containerInfo}>
                <div>Заполнено: {containerInfo.full_bins}</div>
                <div>Всего: {containerInfo.cnt_bins}</div>
              </div>
              <div className={s.containerInfo}>
                Дата последней проверки:{' '}
                {new Date(
                  Math.ceil(containerInfo.time) * 1000
                ).toLocaleString()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
