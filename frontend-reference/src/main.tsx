import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";

const router = getRouter();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

import { HelmetProvider } from "react-helmet-async";

const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    </React.StrictMode>,
  );
}
