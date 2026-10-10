import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import PrizesPage from "./pages/PrizesPage";
import LaureatsPage from "./pages/LaureatsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/prizes" replace />} />
        <Route path="/prizes" element={<PrizesPage />} />
        <Route path="/laureats" element={<LaureatsPage />} />
      </Route>
    </Routes>
  );
}
