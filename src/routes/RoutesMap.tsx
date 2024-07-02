import { lazy, ReactElement } from 'react';

import Loadable from 'components/progress/Loadable';
import AuthGuard from './guards/AuthGuard';
const HomePage = Loadable(lazy(() => import('views/home')));
const MePage = Loadable(lazy(() => import('views/me')));
const TldrawPage = Loadable(lazy(() => import('views/tldraw')));
const LoginPage = Loadable(lazy(() => import('views/login')));

type Route = {
  path: string;
  title?: string;
  element: ReactElement;
};

export const LayoutRoutesMap: Route[] = [
  {
    path: '/',
    title: 'home',
    element: (
      <AuthGuard>
        <HomePage />
      </AuthGuard>
    )
  },
  {
    path: '/profile',
    title: 'profile',
    element: (
      <AuthGuard>
        <MePage />
      </AuthGuard>
    )
  }
];

export const NoLayoutRoutesMap: Route[] = [
  {
    path: '/login',
    title: 'login',
    element: <LoginPage />
  },
  {
    path: '/tldraw',
    title: 'tldraw',
    element: <TldrawPage />
  },
  {
    path: '/another',
    title: 'another',
    element: <TldrawPage />
  },
  {
    path: '/yet-another',
    title: 'yet another',
    element: <TldrawPage />
  }
];

export const AdminRoutes: Route[] = [];

// 定义需要鉴权的路由数组
const protectedRoutes = [
  { path: '/', title: '打卡', component: HomePage, useNavigationScroll: true },
  { path: '/statistics', title: '打卡统计', component: MePage }
];

// 辅助函数：生成带有 AuthGuard 的路由元素
const generateRoutes = (routes) => {
  return routes.map(({ path, title, component: Component, useNavigationScroll }) => ({
    path,
    title,
    element: (
      <AuthGuard>
        <Component />
      </AuthGuard>
    )
  }));
};

// 生成路由配置
export const RoutesMap = generateRoutes(protectedRoutes);
