import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./presentation/Pages/Home";
import About from "./presentation/Pages/About";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
