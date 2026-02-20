import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import SubmitDefectPage from './pages/SubmitDefectPage';
import ViewDefectsPage from './pages/ViewDefectsPage';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SubmitDefectPage,
});

const submitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/submit',
  component: SubmitDefectPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ViewDefectsPage,
});

const routeTree = rootRoute.addChildren([indexRoute, submitRoute, reportsRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
