import { Routes, Route } from "react-router-dom";
import { privateRoutes, publicRoutes } from './routes/routes';
import { AppLayout } from './layouts/AppLayout';
function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            return <Route key={index} path={route.path} element={<Page />} />;
          })}
        </Route>
        {/* <Route element={<AppLayout />}>
          {privateRoutes.map((route, index) => {
            const Page = route.component;
            return <Route key={index} path={route.path} element={<Page />} />;
          })}
        </Route> */}
      </Routes>
    </>
  );
}

export default App;
