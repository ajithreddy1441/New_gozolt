import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Search from "./components/Search";
import AddOns from "./components/Addons";

const stripePromise = loadStripe("pk_test_51RyqAn8NmRubQ6erFqVoKmy3GjgkZ0A3U1D377SYHuu4dy1M9Hx78DS9pcB6DCoHEudzsIsU94oOObVJWzlbbnrq00ZR933njZ");

const App = () => {
  return (
    <Router>
      <Header />
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/search" element={<Search />} />
          <Route path="/addons" element={<AddOns />} />
        </Routes>
      </Elements>
    </Router>
  );
};

export default App;