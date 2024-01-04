import React from "react";
import "./App.css";
import { Routes, Route, HashRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { VideosPage } from "./components/VideosPage";
import { Homepage } from "./components/Homepage";
import { NoPage } from "./components/NoPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="user/:user" element={<VideosPage />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
