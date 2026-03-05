import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Editor from "@/pages/Editor";
import Home from "@/pages/Home";
import Preview from "@/pages/Preview";
import Render from "@/pages/Render";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/render" element={<Render />} />
      </Routes>
    </Router>
  );
}
