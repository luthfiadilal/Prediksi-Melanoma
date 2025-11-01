import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Homes from "./presentation/Pages/Homes";
import About from "./presentation/Pages/About";
import RegisterDoctor from "./presentation/Pages/RegisterDoctor";
import LoginDoctor from "./presentation/Pages/LoginDoctor";
import HistoryPage from "./presentation/Pages/History";

export default function App() {
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctorData");
    if (storedDoctor) {
      setDoctor(JSON.parse(storedDoctor));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("doctorData");
    localStorage.removeItem("supabaseSession");
    window.location.href = "/login";
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homes />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<RegisterDoctor />} />
        <Route path="/login" element={<LoginDoctor />} />
        <Route
          path="/history"
          element={<HistoryPage doctor={doctor} handleLogout={handleLogout} />}
        />
      </Routes>
    </Router>
  );
}
