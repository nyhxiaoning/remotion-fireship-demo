import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import CreateTemplate from "@/pages/CreateTemplate";
import Editor from "@/pages/Editor";
import Home from "@/pages/Home";
import Preview from "@/pages/Preview";
import Render from "@/pages/Render";
import ProductPreview from "@/pages/ProductPreview";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-template" element={<CreateTemplate />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/render" element={<Render />} />
        <Route path="/product-preview" element={<ProductPreview />} />
      </Routes>
    </Router>
  );
}
