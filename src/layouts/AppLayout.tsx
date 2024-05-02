import { Outlet } from "react-router-dom";
import { Header } from "../pages/Header";
import { FC, useEffect } from "react";
import WalletAdapter from "../components/WalletAdapter";

const AppLayout: FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
        {/* <WalletAdapter /> */}
      </main>
    </div>
  );
};

export { AppLayout };