import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";

const Games = lazy(() => import("./pages/Games"));
const ItemDetails = lazy(() => import("./pages/ItemDetails"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "about", element: <About /> },
        { path: "games", element: <Games /> },
        { path: "games/:id", element: <ItemDetails /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "login", element: <Login /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  {
    basename: "/react/games",
  },
);

export default function App() {
  return (
    <Suspense fallback={<p className="state">Loading page...</p>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
