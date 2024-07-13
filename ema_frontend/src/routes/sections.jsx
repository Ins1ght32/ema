import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from 'src/layouts/dashboard';

const IndexPage = lazy(() => import('src/pages/app'));
const UserPage = lazy(() => import('src/pages/user'));
const LoginPage = lazy(() => import('src/pages/login'));
const ProductsPage = lazy(() => import('src/pages/products'));
const Page404 = lazy(() => import('src/pages/page-not-found'));
const Admin = lazy(() => import('src/pages/admin'));
const ChatPage = lazy(() => import('src/pages/chat')); // Import the Chat component
const AssetPage = lazy(() => import('src/pages/assets'));

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <LoginPage />
        </Suspense>
      ),
      index: true,
    },
    {
      path: '/',
      element: (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { path: 'dashboard', element: <IndexPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'assets', element: <AssetPage /> },
        { path: 'admin', element: <Admin /> },
        { path: 'chat', element: <ChatPage /> }, // Add the Chat route
      ],
    },
    {
      path: '404',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Page404 />
        </Suspense>
      ),
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    {
      path: 'login',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <LoginPage />
        </Suspense>
      ),
    },
  ]);

  return routes;
}
