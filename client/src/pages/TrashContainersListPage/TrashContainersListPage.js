import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Addresses } from '../../constants/Addresses';
import { AppRoutes } from '../../constants/AppRoutes';
import s from './TrashContainersListPage.module.scss';

export const TrashContainersListPage = () => {
  const [allAddressTrashInfo, setAllAddressTrashInfo] = useState([]);

  useEffect(() => {
    setAllAddressTrashInfo(Addresses);
  }, []);

  return allAddressTrashInfo.map((a) => {
    return (
      <Card
        key={`${a.id}_${a.text}`}
        bg="dark"
        style={{ width: '50%', margin: '0 auto', marginBottom: '30px' }}
      >
        <Card.Header>{a.text}</Card.Header>
        <Card.Body>
          <div className={s.cardBodyContent}>
            <img className={s.trashImg} src={a.trashImg} alt={a.text} />
            <div className={s.info}>
              <div
                className={classNames(s.infoItem, s.filling, {
                  [s.isFill]: a.isFill,
                })}
              >
                Заполнен: {a.isFill ? 'Да' : 'Нет'}
              </div>
              <div className={classNames(s.infoItem)}>
                Дата последней проверки: {a.date.toLocaleString()}
              </div>
            </div>
          </div>
          <Button variant="success">
            <Link to={AppRoutes.GetRoutToTrashContainer(a.id)}>Подробнее</Link>
          </Button>
        </Card.Body>
      </Card>
    );
  });
};
