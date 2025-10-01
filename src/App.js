import React, { useEffect, useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import HomePage from './pages/HomePage';
import DetailServicesPage from './pages/DetailServicesPage';
import DetailProjectPage from './pages/DetailProjectPage';
import ContractPage from './pages/ContractPage';
import AboutPage from './pages/AboutPage';
import ProjectPage from './pages/ProjectPage';
import ServicePage from './pages/ServicePage';
import ShowRoomPage from './pages/ShowRoomPage';

// auth
import LoginPage from './pages/auth/LoginPage';
import AdminPage from './pages/auth/AdminPage';
import DetailAuthServicesPage from './pages/auth/DetailAuthServicesPage';
import DetailAuthProjectPage from './pages/auth/DetailAuthProjectPage';

// component
import Header from './components/Header';
import HeaderAuth from './components/auth/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';


function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login" || location.pathname === "/showroom";
  const isAdminPage = location.pathname.startsWith("/admin_akebono");


  return (
    <>
      {!isLoginPage && !isAdminPage && <Header />}
      {!isLoginPage && isAdminPage && <HeaderAuth />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detailServices/:name" element={<DetailServicesPage />} />
        <Route path="/detailProject/:name" element={<DetailProjectPage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/contact" element={<ContractPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/showroom" element={<ShowRoomPage />} />
        {/* auth */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin_akebono" element={<AdminPage />} />
          <Route path="/admin_akebono/detail/:name" element={<DetailAuthServicesPage />} />
          <Route path="/admin_akebono/detailProject/:name" element={<DetailAuthProjectPage />} />
        </Route>
      </Routes>
      {!isLoginPage && <Footer />}
    </>
  );
}

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
    });
  }, []);
  return (
    <Router>
      <Layout />
    </Router>
  );
};
export default App;
