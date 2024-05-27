import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { FC } from "react";

const AppLayout: FC = () => {
  return (
    <div>
      <Header />
      <div className="flex">
        <main className="flex-1 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export { AppLayout };