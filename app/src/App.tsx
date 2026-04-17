import "./index.css";
import "./config/i18n.ts";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth";
import Thoughts from "./pages/thoughts";

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-beige/60 min-h-screen overscroll-none">
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Auth />} />
            <Route path="/thoughts/*" element={<Thoughts />} />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
