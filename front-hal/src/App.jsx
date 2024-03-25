import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css";
import GetQueryData from "./components/QueryData";
import Gard from './components/gard';
import Home from './components/Home';
import SearchPersonForm from './components/SearchComponent';
const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api";

function App() {
  return (
    <Router>
      <div className="centered-container">
        <Routes>
          <Route path="/query-data" element={<GetQueryData backendURL={backendURL} />} />
          <Route path="/grad" element={<Gard backendURL={backendURL} selectedTable={"all_data"} />} />
          <Route path="/" element={<Home/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
