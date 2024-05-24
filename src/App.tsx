import { Routes, Route } from "react-router-dom";
import { publicRoutes } from './routes/routes';
import { AppLayout } from './layouts/AppLayout';
import 'react-toastify/dist/ReactToastify.css';

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
