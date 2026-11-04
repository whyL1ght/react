import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function RootLayout() {
  return (
    <>
      <NavBar />
      <main className="container">
        <Outlet />
      </main>
      <footer>PIXEL QUEST · educational video game catalog</footer>
    </>
  );
}
