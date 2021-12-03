import classNames from 'classnames';
import { Link, useResolvedPath, useMatch } from 'react-router-dom';
import { AppRoutes } from '../../constants/AppRoutes';
import s from './Sidebar.module.scss';

export const Sidebar = ({ className }) => {
  return (
    <div className={classNames(className, s.wrapper)}>
      <div className={classNames(s.navigation)}>
        <SidebarNavButton
          text={AppRoutes.Map.title}
          route={AppRoutes.Map.route}
        />
        <SidebarNavButton
          text={AppRoutes.TrashContainersList.title}
          route={AppRoutes.TrashContainersList.route}
        />
      </div>
    </div>
  );
};

const SidebarNavButton = ({ text, route }) => {
  const resolved = useResolvedPath(route);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link
      className={classNames(s.navLink, { [s.navLinkAcitve]: match })}
      to={route}
    >
      {text}
    </Link>
  );
};
