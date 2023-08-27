import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Catatan ALi => lanjutan Project => yang di koment semua nya
// * like commentar =>
import Forgout from "./pages/login/Forgout.jsx";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import Profil from "./pages/profil/Profil";
import Post from "./pages/Post";
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
        path: "/profil/:id",
        element: <Profil />,
        title: "PROFIL",
      },
      { path: "/post/:id", element: <Post />, title: "POST" },
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
    <GoogleOAuthProvider clientId="697977968992-hoklnd9077ntc7bbordionb6e90si9pu.apps.googleusercontent.com">
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
