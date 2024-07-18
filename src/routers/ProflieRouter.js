import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spin } from 'antd';

// Sử dụng React.lazy để tải lười biếng các component
const WishList = lazy(() => import("../pages/WishList"));
const UserAccount = lazy(() => import('../pages/UserAccount'));
const Cart = lazy(() => import('../pages/Cart'));
const Order = lazy(() => import('../pages/Order'));
const Post = lazy(() => import('../pages/Post'));

const Profile = () => {
  return (
    <div>
      <Suspense fallback={<Spin size="large"  fullscreen/>}>
        <Routes>
          <Route index element={<UserAccount />} />
          <Route path="/account" index element={<UserAccount />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/notification" element={<UserAccount />} />
          <Route path="/change-password" element={<UserAccount />} />
          <Route path="/address" element={<UserAccount />} />
          <Route path="/order-history" element={<UserAccount />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/my-post" element={<Post />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Profile;
