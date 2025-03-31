import React from 'react';
import Sidebar from './Components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import AddExperiment from './pages/AddExperiment';
import './App.css';
import Navbar from './Components/Navbar';
import OpenCvTest from './Components/OpenCvTest';

const App = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="p-3">
        {/* <Navbar /> */}
        <OpenCvTest />
        <Routes>
          <Route path="/experiments/add" element={<AddExperiment />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
