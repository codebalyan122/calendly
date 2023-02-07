import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Auth from "./Authentication/Auth";
import Home from "./components/Home";
import AllMeetings from "./components/AllMeetings";
import { useState } from "react";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Auth />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/allmeetings" element={<AllMeetings />} />
      </Routes>
    </div>
  );
}

export default App;
