import classNames from 'classnames';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import s from './App.module.scss';
import { Sidebar } from './components/Sidebar/Sidebar';
import { AppRoutes } from './constants/AppRoutes';
import { MapPage } from './pages/MapPage/MapPage';
import { RedirectPage } from './pages/RedirectPage';
import { TrashContainerPage } from './pages/TrashContainerPage/TrashContainerPage';
import { TrashContainersListPage } from './pages/TrashContainersListPage/TrashContainersListPage';

export const App = () => {
  return (
    <BrowserRouter>
      <div className={classNames(s.appWrapper)}>
        <Sidebar className={s.sidebar} />
        <div className={classNames(s.appContent)}>
          <Routes>
            <Route path={AppRoutes.Map.route} element={<MapPage />} />
            <Route
              path={AppRoutes.TrashContainer.route}
              element={<TrashContainerPage />}
            />
            <Route
              path={AppRoutes.TrashContainersList.route}
              element={<TrashContainersListPage />}
            />
            <Route path="*" element={<RedirectPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

// 1) Баки на карте, при нажатии краткая инфа, и перейти к полной
// 2) Список баков?
