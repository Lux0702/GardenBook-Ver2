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
import DashboardCard from "../components/dashboard/DashboardCard";
import UserInfo from "../components/dashboard/ManageUser";
import ProductList from "../components/dashboard/ManagerBook";
import SalesStats from  "../components/dashboard/SalesStats";
import ProductStats from  "../components/dashboard/ProductStats";
import OrderList from  "../components/dashboard/OrderList";
import CustomerList from  "../components/dashboard/CustomerList";
import ArticleApproval from  "../components/dashboard/ArticleApproval";
import ArticleStats from  "../components/dashboard/ArticleStats";
import AddProduct from  "../components/dashboard/AddProduct";
import ManageCategories from  "../components/dashboard/ManageCategories";
import BlackList from  "../components/dashboard/BlackList";
import ManageUser from "../components/dashboard/ManageUser";
import OrderStatistics from "../components/dashboard/ProductStats";
import ProductStatistics from "../components/dashboard/ProductStatistics";
import StatisticsPage from "../components/dashboard/StatistitisPage";
import AddDiscount from "../components/dashboard/AddDiscount";
import NotificationManager from "../components/dashboard/AddNotification";
import DiscountBook from "../pages/DiscountBook";
import { Layout } from 'antd';
import WebSocketManager from '../services/WebSocketManager';
import DeleteBook from "../components/dashboard/DeleteBook";
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
  const user = JSON.parse(localStorage.getItem('userInfo') || '""');

  return (
  <Router>
    <Layout>
    {/* {user && <WebSocketManager user={user} />} */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book-detail/:id" element={<BookDetails />} />
        <Route path="/books/" element={<Books />} />
        <Route path="/books/discount" element={<DiscountBook />} />
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
        <Route path="/admin/login" element={<Login />} />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
          <Route path="/admin" element={<Dashboard />}>
            <Route path="dashboard" element={<DashboardCard />} />
            <Route path="customer-list" element={<CustomerList />} />
            <Route path="employee-list" element={<ManageUser />} />
            <Route path="order-list" element={<OrderList />} />
            <Route path="article-approval" element={<ArticleApproval />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="manage-categories" element={<ManageCategories />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="sales-stats" element={<SalesStats />} />
            <Route path="order-stats" element={<OrderStatistics />} />
            <Route path="product-stats" element={<ProductStatistics />} />
            <Route path="article-stats" element={<ArticleStats />} />
            <Route path="black-List" element={<BlackList />} />
            <Route path="statistic" element={<StatisticsPage />} />
            <Route path="add-discount" element={<AddDiscount />} />
            <Route path="add-notification" element={<NotificationManager />} />
            <Route path="delete-book" element={<DeleteBook />} />

          </Route>
      </Routes>  
    </Layout>
    
  </Router>
  );
};

// const OTPInputWrapper = () => {
//   const { email } = useParams();

//   return <OTPInput email={email} />;
// };

export default AppRouter;
