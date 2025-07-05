import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/User/Home/Home";
import Login from "./pages/Account/Login/Login";
import Register from "./pages/Account/Register/Register";
import RegisterTechnician from "./pages/Account/RegisterTechnician/RegisterTechnician";
import About from "./pages/User/About/About";
import Contact from "./pages/User/Contact/Contact";
import Service from "./pages/User/ServicePage/Service";
import Booking from "./pages/User/Booking/Booking";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import Technicians from "./pages/Admin/Technicians/Technicians";
import AdminRoute from "./route/AdminRoute";
import TechRoute from "./route/TechRoute";
import UserRoute from "./route/UserRoute";
import Services from "./pages/Admin/Services/Services";
import RepairOrders from "./pages/Admin/RepairOrders/RepairOrders";
import NotFoundPage from "./pages/User/404/404Page";
import ForgotPassword from "./pages/Account/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/Account/ResetPassword/ResetPassword";
import Profile from "./pages/User/Profile/Profile";
import BookingDetail from "./pages/User/BookingDetail/BookingDetail";
import AdminBlog from "./pages/Admin/Blog/Blog";
import Blog from "./pages/User/Blog/Blog";
import BlogDetail from "./pages/User/Blog/BlogDetail";
import BlogByTag from "./pages/User/Blog/BlogbyTag";
import ContactAdmin from "./pages/Admin/Contact/Contact";
import DashboardTechnician from "./pages/Technician/Dashboard/Dashboard";
import RequestRepair from "./pages/Technician/RequestRepair/RequestRepair";
import TechnicianOrders from "./pages/Technician/Orders/Orders";
function App() {
  return (
    <Routes>
      <Route path="/*" element={<NotFoundPage />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register-technician" element={<RegisterTechnician />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<Service />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />
      <Route path="/blog/tag/:query" element={<BlogByTag />} />
      {/* User */}
      <Route exact path="/" element={<UserRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/booking/:bookingId" element={<BookingDetail />} />
      </Route>
      {/* Admin */}
      <Route exact path="/" element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/technicians" element={<Technicians />} />
        <Route path="/admin/services" element={<Services />} />
        <Route path="/admin/orders" element={<RepairOrders />} />
        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/admin/customer-contact" element={<ContactAdmin />} />
      </Route>
      {/* Technician */}
      <Route exact path="/" element={<TechRoute />}>
        <Route path="/technician/dashboard" element={<DashboardTechnician />} />
        <Route path="/technician/request-repair" element={<RequestRepair />} />
        <Route path="/technician/orders" element={<TechnicianOrders />} />
      </Route>
    </Routes>
  );
}
export default App;
