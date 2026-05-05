import "./index.css";
import "./config/i18n.ts";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth";
import Thoughts from "./pages/thoughts";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthBootstrap from "./hooks/useAuthBootstrap";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const isReady = useAuthBootstrap();

  if (!isReady) {
    return (
      <div className="bg-beige/80 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark_blue" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-beige/80 min-h-screen overscroll-none">
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Auth />} />
            <Route
              path="/thoughts/*"
              element={
                <ProtectedRoute>
                  <Thoughts />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
