import { useRoutes } from 'react-router-dom';
import { NotFound, RedirectNotFound } from './404';
import { LayoutRoutesMap, NoLayoutRoutesMap } from './RoutesMap';

import MainLaylout from 'components/layout';

const UserRoutes = {
  path: '/',
  element: <MainLaylout />,
  children: LayoutRoutesMap
};

const NoLayoutRoutes = {
  path: '/',
  children: NoLayoutRoutesMap
};

export default function Routes() {
  return useRoutes([UserRoutes, NoLayoutRoutes, RedirectNotFound, NotFound]);
}
