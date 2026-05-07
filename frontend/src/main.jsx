import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./common/Layout";
import AuthenticatePage from "./authentication/AuthenticatePage";
import SessionPage from "./sessions/SessionPage";
import ProfilePage from "./profile/ProfilePage";
import BlogPage from "./blog/BlogPage";
import ExportPage from "./export/ExportPage";
import { AuthenticationProvider } from "./authentication/useAuthenticate"; 


const router = createBrowserRouter([

    {
      Component: Layout,
      children: [ 
        {
          path: "/authenticate",
          Component: AuthenticatePage,
        },
        {
          path: "/sessions",
          Component: SessionPage,
        },
        {
          path: "/profile",
          Component: ProfilePage,
        },
        {
          path: "/posts",
          Component: BlogPage,
        },
        {
          path: "/export",
          Component: ExportPage,
        },
      ]
    },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthenticationProvider>
      <RouterProvider router={router} />
    </AuthenticationProvider>
  </StrictMode>
);