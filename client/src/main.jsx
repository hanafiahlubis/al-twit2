import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import App from "./App";

// Catatan ALi => lanjutan Project => yang di koment semua nya
// * like commentar =>
import Forgout from "./pages/login/Forgout.jsx";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
export const pages = [
  {
    path: "/login",
    element: <Login />,
    title: "LOGIN",
  },
  {
    path: "/forgout",
    element: <Forgout />,
  },
  {
    path: "/register",
    element: <Register />,
    title: "Register",
  },
  {
    children: [
      {
        path: "/",
        element: <Home />,
        title: "HOME",
      },
      {
        path: "/profil",
        element: <Home />,
        title: "PROFIL",
      },
    ],
  },
];

const router = createBrowserRouter([
  {
    element: <App />,
    children: pages,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
