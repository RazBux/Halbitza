import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GetQueryData from "./components/QueryData";
import Guard from './components/gard';
import Home from './components/Home';

const apiV = 'api/v1'
const backendURL = process.env.REACT_APP_BACKEND_URL || `http://localhost:8000/${apiV}`;

function App() {
  return (
    <Router>
      <div className="centered-container">
        <Routes>
          <Route path="/query-data" element={<GetQueryData backendURL={backendURL} />} />
          <Route path="/gurad" element={<Guard backendURL={backendURL} selectedTable={"all_data"} />} />
          <Route path="/" element={<Home/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
