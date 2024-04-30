import { Outlet } from "react-router-dom";
import { Header } from "../pages/Header";
import { Wallet } from "../components/WalletAdapter";

const AppLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export { AppLayout };