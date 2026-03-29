import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

function App({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-beige/90 min-h-screen overscroll-none">
        <div className="max-w-7xl mx-auto py-4">{children}</div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
