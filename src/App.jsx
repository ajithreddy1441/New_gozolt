import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Search from "./components/Search";
import AddOns from "./components/Addons";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/search" element={<Search />} />
        <Route path="/addons" element={<AddOns />} />
      </Routes>
    </Router>
  );
};

export default App;