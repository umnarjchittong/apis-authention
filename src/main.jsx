import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
// import "./index.css";
import App from "./App.jsx";
// import "./assets/styles.css";
import "./assets/app.css";
const basePath = import.meta.env.VITE_BASE_PATH || "/";

import { AppProvider } from "./providers/AppContext.jsx";
import Err404 from "./errors/Error404.jsx";
import MjuSsoLogin from "./services/mjuSso.jsx";
import { CookiesProvider } from "react-cookie";
import { AuthProvider } from "./providers/AuthContext.jsx";

const router = createBrowserRouter(
    [
        {
            path: "*",
            element: <Err404 />,
        },
        {
            path: "",
            element: <App />,
        },
        {
            path: "/login",
            element: <MjuSsoLogin />,
        },
    ],
    { basename: basePath },
);

createRoot(document.getElementById("root")).render(
    // <StrictMode>
        <CookiesProvider>
            <AppProvider>
                <AuthProvider>
                <RouterProvider router={router} />
                </AuthProvider>
            </AppProvider>
        </CookiesProvider>
    // </StrictMode>,
);
