import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/home';
import Convert from './pages/Convert';
import FAQ from './components/faq';


const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/convert" element={<Layout><Convert /></Layout>} />
       
        <Route path="/faq" element={<Layout><FAQ /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;