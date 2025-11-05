
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "../components/client/Header";
import Footer from "../components/client/Footer";


import Home from "../pages/client/Home";
import Contact from "../pages/client/Contact";
function ClientLayout() {
  return (
    <div className="client-layout" style={{ backgroundColor: "#faf9f9" }}>


      <Header />
      <main className="min-vh-100">
       

        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default ClientLayout;
