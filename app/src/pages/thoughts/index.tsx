import { Route, Routes } from "react-router-dom";
import ThoughtsList from "./list";
import ThoughtView from "./view";
import ThoughtCreate from "./create";

export default function Thoughts() {
  return (
    <Routes>
      <Route index element={<ThoughtsList />} />
      <Route path="new" element={<ThoughtCreate />} />
      <Route path=":id" element={<ThoughtView />} />
    </Routes>
  );
}
