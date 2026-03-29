import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";

export default function Auth() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}
