import { Outlet } from "react-router-dom";
import { Header } from "../pages/Header";
import { FC } from "react";

const AppLayout: FC = () => {
  return (
    <div>
      {/* <Header /> */}
      <div className="flex h-screen bg-gradient-117">
        <main className="flex-1 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export { AppLayout };