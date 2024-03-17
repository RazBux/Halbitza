import React from 'react';
import "./App.css";
import GetQueryData from "./components/QueryData";

const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api";

function App() {
  return (
    <div className="centered-container">
     
      {/* Pass backendURL as a prop */}
      <GetQueryData backendURL={backendURL} />
      
    </div>
  );
}

export default App;
