import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <h1 className="text-6xl underline font-mogi font-extrabold">MINDY</h1>
      <h3 className="text-2xl font-general font-light">
        Get rid of your intrusive thoughts, find peace.
      </h3>
    </QueryClientProvider>
  );
}

export default App;
