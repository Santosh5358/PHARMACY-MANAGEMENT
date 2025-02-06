import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ViewProfile from './components/ViewProfile';
import ContactUs from './components/ContactUs';
import OrderList from './components/OrderList';

function App() {
  return (
    <Router>
      <Header />
      <div className="container mt-4 mb-4 " style={{ minHeight: '480px' }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/OderList" element={<OrderList />} />
        <Route path="/viewProfile" element={<ViewProfile />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
