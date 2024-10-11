import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "normalize.css";
import Logout from "./Components/Logout/Logout.jsx";
import Login from "./Pages/Login/Login.jsx";
import Register from "./Pages/Register/Register.jsx";
import NotFound from "./Pages/NotFound/NotFound.jsx";
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import ProtectedRoute from "./Components/protectedRoute.jsx";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/Register",
    element: <Register />,
  },
  {
    path: "/Dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Logout",
    element: <Logout />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    
      <RouterProvider router={router} />

  </React.StrictMode>
);
