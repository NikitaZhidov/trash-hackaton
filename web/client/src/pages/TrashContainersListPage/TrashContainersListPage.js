import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { trashApi } from '../../api/trash.api';
import { isCriticalFilling } from '../../components/Marker/MapMarker';
import { SpinnerPreloader } from '../../components/ui/SpinnerPreloader';
import { Addresses } from '../../constants/Addresses';
import { AppRoutes } from '../../constants/AppRoutes';
import { useFetching } from '../../hook/useFething';
import s from './TrashContainersListPage.module.scss';

export function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const TrashContainersListPage = () => {
  const [containersInfo, setContainersInfo] = useState([]);
  const [showOnlyFilled, setShowOnlyFilled] = useState(false);

  const [fetchTrashContainersInfo, isLoadingTrashContainers] = useFetching(
    async () => {
      const containers = await trashApi.getTrashContainers();
      setContainersInfo(
        containers.map((c) => ({
          ...c,
          timeToFill: `${randomIntFromInterval(3, 7) * 24}ч`,
        }))
      );
    }
  );

  useEffect(() => {
    setContainersInfo(Addresses);
  }, []);

  useEffect(() => {
    fetchTrashContainersInfo();
  }, []);

  return isLoadingTrashContainers ? (
    <SpinnerPreloader />
  ) : (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '15px',
        }}
      >
        <Form.Check
          value={showOnlyFilled}
          onChange={() => setShowOnlyFilled(!showOnlyFilled)}
          label="Требуют обслуживания"
        />
      </div>
      {containersInfo.map((containerInfo) => {
        if (
          !showOnlyFilled ||
          isCriticalFilling(containerInfo.cnt_bins, containerInfo.full_bins)
        )
          return (
            <Card
              key={`_${containerInfo.address.id}`}
              bg="dark"
              style={{ width: '50%', margin: '0 auto', marginBottom: '30px' }}
            >
              <Card.Header>
                {containerInfo.address.id}#: {containerInfo.address.address}
              </Card.Header>
              <Card.Body>
                <div className={s.cardBodyContent}>
                  <img
                    src={`${containerInfo.imgSrc}`}
                    className={s.trashImg}
                    alt={containerInfo.text}
                  />
                  <div className={s.info}>
                    <div className={classNames(s.infoItem)}>
                      <div
                        className={classNames(s.filling, {
                          [s.isFill]: isCriticalFilling(
                            containerInfo.cnt_bins,
                            containerInfo.full_bins
                          ),
                        })}
                      >
                        Заполнено: {containerInfo.full_bins}
                      </div>
                      <div>Всего: {containerInfo.cnt_bins}</div>
                      <div>
                        Среднее время заполняемости бака:{' '}
                        {containerInfo.timeToFill}
                      </div>
                    </div>
                    <div className={classNames(s.infoItem)}>
                      Дата последней проверки:{' '}
                      {new Date(
                        Math.ceil(containerInfo.time) * 1000
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
                <Link
                  to={AppRoutes.GetRoutToTrashContainer(
                    containerInfo.address.id
                  )}
                >
                  <Button variant="success">Подробнее</Button>
                </Link>
              </Card.Body>
            </Card>
          );
      })}
    </>
  );
};
