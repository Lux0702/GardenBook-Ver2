import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import WishList from "../pages/WishList";
import UserAccount from '../pages/UserAccount';
import Cart from '../pages/Cart';
import Order from '../pages/Order';
import Post from '../pages/Post';
const Profile = () => {
  return (
    <div>
      <Routes>
        <Route index element={<UserAccount/>} />
        <Route path="/account" index element={<UserAccount />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/notification" element={<UserAccount />} />
        <Route path="/change-password" element={<UserAccount />} />
        <Route path="/address" element={<UserAccount />} />
        <Route path="/order-history" element={<UserAccount />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order/>} />
        <Route path="/my-post" element={<Post/>} />


      </Routes>
    </div>
  );
};

export default Profile;
