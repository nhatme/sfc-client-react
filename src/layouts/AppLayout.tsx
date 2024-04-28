import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../pages/Header";

const AppLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export { AppLayout };