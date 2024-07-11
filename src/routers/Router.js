// AppRouter.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import BookDetails from "../pages/BookDetail";
import Books from "../pages/Books";
import PrivateRoute from "../services/PrivateRoute";
import ProfileRouter from "./ProflieRouter"
import OTPInput from "../pages/OTPVerify";
import Post from "../pages/Post";
import Login from "../pages/dashboard/Login";
import Dashboard from "../pages/dashboard/Dashboard";
// import Login from "../pages/Login";
// import Register from '../pages/Register'
// import ProductDetail from '../pages/ProductDetail'
// import Order from '../pages/Order'
// import ForgotPassword from '../pages/ForgotPassword'
// import ResetPassword from '../pages/ResetPassword'
// import Cart from "../pages/Cart";
// import OTPInput from "../pages/SendOTP"
// import DashboardPage from "../Admin/dashboard"
// import ProfilePage from "../pages/Profile"
// import ProfileInfor from "../parts/ProfileInfor"
// import PrivateRoute from "./PrivateRouter"; 
// import Product from "../pages/Product"
// import OTP from "../pages/OTP";
// import Changepassword from "../pages/ChangePassword";
// import HistoryOrder from "../parts/HistoryOrder";
// import ListAddress from "../parts/ListAddress";
// import ProductList from "../parts/ProductList";
// import Post from "../pages/Post";
// import YourPost from "../parts/YourPost";
// import ManagePost from "../parts/managYourPost";
// import LoginPost from "../pages/loginPost";
// import WishList from "../pages/WishList";
const AppRouter = () => {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book-detail/:id" element={<BookDetails />} />
      <Route path="/books/" element={<Books />} />
      <Route path="/email/forgotpassword/verify" element={<OTPInput/>} />
      <Route path="/email/register/verify" element={<OTPInput/>} />
      <Route path="/post" element={<Post/>} />
      <Route path="/profile/*" element={
        <PrivateRoute>
          <ProfileRouter />
        </PrivateRoute>
      } />
      <Route path="/login" element={<Home />} />
      <Route path="/register" element={<Home />} />
      <Route path="/post/login" element={<Post />} />
      <Route path="/admin/login" element={<Login/>} />
      <Route path="*" element={<p>There's nothing here: 404!</p>} />
      <Route path="/admin/dashboard" element={<Dashboard/>} />


    </Routes>
  </Router>
  );
};

// const OTPInputWrapper = () => {
//   const { email } = useParams();

//   return <OTPInput email={email} />;
// };

export default AppRouter;
