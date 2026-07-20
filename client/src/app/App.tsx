import { RouterProvider } from "react-router-dom";

import { router } from "./router";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

function AppInitializer() {
  useCurrentUser();

  return <RouterProvider router={router} />;
}

export default function App() {
  return <AppInitializer />;
}
