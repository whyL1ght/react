import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";

const Games = lazy(() => import("./pages/Games"));
const ItemDetails = lazy(() => import("./pages/ItemDetails"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const CreateGame = lazy(() => import("./pages/CreateGame"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
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
        {
          path: "games/new",
          element: (
            <ProtectedRoute>
              <CreateGame />
            </ProtectedRoute>
          ),
        },
        { path: "games/:id", element: <ItemDetails /> },
        { path: "favorites", element: <Favorites /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "login", element: <Login /> },
        { path: "signup", element: <Signup /> },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p className="state">Loading page...</p>}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  );
}
