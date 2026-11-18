import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import UpdatePrompt from "./UpdatePrompt";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function RootLayout() {
  const online = useOnlineStatus();

  return (
    <>
      <UpdatePrompt />
      <NavBar />
      {!online && (
        <p className="offline-bar">
          You are offline. You are viewing cached data.
        </p>
      )}
      <main className="container">
        <Outlet />
      </main>
      <footer>PIXEL QUEST · educational video game catalog</footer>
    </>
  );
}
