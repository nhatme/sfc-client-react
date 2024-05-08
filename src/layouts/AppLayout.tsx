import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { FC } from "react";

const AppLayout: FC = () => {
  return (
    <div>
      <Header />
      <div className="flex h-screen bg-gradient-117-to-r">
        <main className="flex-1 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export { AppLayout };