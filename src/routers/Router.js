import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout, Spin} from 'antd';
import PrivateRoute from "../services/PrivateRoute";
import PrivateAdmin from "../services/PrivateAdmin";
import WebSocketManager from '../services/WebSocketManager';

// Sử dụng React.lazy để tải lười biếng các component
const Home = lazy(() => import("../pages/Home"));
const BookDetails = lazy(() => import("../pages/BookDetail"));
const Books = lazy(() => import("../pages/Books"));
const ProfileRouter = lazy(() => import("./ProflieRouter"));
const OTPInput = lazy(() => import("../pages/OTPVerify"));
const Post = lazy(() => import("../pages/Post"));
const Login = lazy(() => import("../pages/dashboard/AdminLogin"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const DashboardCard = lazy(() => import("../components/dashboard/DashboardCard"));
const UserInfo = lazy(() => import("../components/dashboard/ManageUser"));
const ProductList = lazy(() => import("../components/dashboard/ManagerBook"));
const SalesStats = lazy(() => import("../components/dashboard/SalesStats"));
const ProductStats = lazy(() => import("../components/dashboard/ProductStats"));
const OrderList = lazy(() => import("../components/dashboard/OrderList"));
const CustomerList = lazy(() => import("../components/dashboard/CustomerList"));
const ArticleApproval = lazy(() => import("../components/dashboard/ArticleApproval"));
const ArticleStats = lazy(() => import("../components/dashboard/ArticleStats"));
const AddProduct = lazy(() => import("../components/dashboard/AddProduct"));
const ManageCategories = lazy(() => import("../components/dashboard/ManageCategories"));
const BlackList = lazy(() => import("../components/dashboard/BlackList"));
const ManageUser = lazy(() => import("../components/dashboard/ManageUser"));
const OrderStatistics = lazy(() => import("../components/dashboard/ProductStats"));
const ProductStatistics = lazy(() => import("../components/dashboard/ProductStatistics"));
const StatisticsPage = lazy(() => import("../components/dashboard/StatistitisPage"));
const AddDiscount = lazy(() => import("../components/dashboard/AddDiscount"));
const NotificationManager = lazy(() => import("../components/dashboard/AddNotification"));
const DiscountBook = lazy(() => import("../pages/DiscountBook"));
const DeleteBook = lazy(() => import("../components/dashboard/DeleteBook"));

const AppRouter = () => {
  const user = JSON.parse(localStorage.getItem('userInfo') || '""');

  return (
    // <Router>
      <Layout>
        {/* {user && <WebSocketManager user={user} />} */}
        <Suspense>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book-detail/:id" element={<BookDetails />} />
            <Route path="/books/" element={<Books />} />
            <Route path="/books/discount" element={<DiscountBook />} />
            <Route path="/email/forgotpassword/verify" element={<OTPInput />} />
            <Route path="/email/register/verify" element={<OTPInput />} />
            <Route path="/post" element={<Post />} />
            <Route path="/profile/*" element={
              <PrivateRoute>
                <ProfileRouter />
              </PrivateRoute>
            } />
            <Route path="/login" element={<Home />} />
            <Route path="/register" element={<Home />} />
            <Route path="/post/login" element={<Post />} />
            <Route path="/adminlogin" element={<Login />} />
            <Route path="*" element={<p>There's nothing here: 404!</p>} />
            <Route path="/admin" element={
                <PrivateAdmin>
                  <Dashboard />
                </PrivateAdmin>
              }>
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
        </Suspense>
      </Layout>
    // </Router>
  );
};

export default AppRouter;
