import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import CategoryDetailScreen from './screens/CategoryDetailScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import PaymentResultScreen from './screens/PaymentResultScreen';
import OrderTrackingScreen from './screens/OrderTrackingScreen';
import DeliveryLoginScreen from './screens/delivery/DeliveryLoginScreen';
import DeliveryDashboardScreen from './screens/delivery/DeliveryDashboardScreen';
import DeliveryOrderDetailsScreen from './screens/delivery/DeliveryOrderDetailsScreen';
import AdminLoginScreen from './screens/admin/AdminLoginScreen';
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';
import AdminProductsScreen from './screens/admin/AdminProductsScreen';
import AdminCategoriesScreen from './screens/admin/AdminCategoriesScreen';
import AdminReportsScreen from './screens/admin/AdminReportsScreen';
import AdminOrdersScreen from './screens/admin/AdminOrdersScreen';
import AdminPartnersScreen from './screens/admin/AdminPartnersScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ReviewScreen from './screens/ReviewScreen';
import ProfileScreen from './screens/ProfileScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import DeliveryAddressesScreen from './screens/DeliveryAddressesScreen';
import { AuthProvider, AuthContext } from './context/AuthContext';
import './index.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, role } = React.useContext(AuthContext);
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <div>Unauthorized Access</div>;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/login" element={<LoginScreen />} />
          {/* Customer App Routes */}
          <Route path="/home" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><HomeScreen /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CategoriesScreen /></ProtectedRoute>} />
          <Route path="/category/:id" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CategoryDetailScreen /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CartScreen /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CheckoutScreen /></ProtectedRoute>} />
          <Route path="/payment-result/:id" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><PaymentResultScreen /></ProtectedRoute>} />
          <Route path="/tracking/:id" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><OrderTrackingScreen /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><NotificationsScreen /></ProtectedRoute>} />
          <Route path="/review" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><ReviewScreen /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><ProfileScreen /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><MyOrdersScreen /></ProtectedRoute>} />
          <Route path="/addresses" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><DeliveryAddressesScreen /></ProtectedRoute>} />
          
          {/* Delivery App Routes */}
          <Route path="/delivery/login" element={<DeliveryLoginScreen />} />
          <Route path="/delivery/dashboard" element={<ProtectedRoute allowedRoles={['DELIVERY_PARTNER']}><DeliveryDashboardScreen /></ProtectedRoute>} />
          <Route path="/delivery/order/:id" element={<ProtectedRoute allowedRoles={['DELIVERY_PARTNER']}><DeliveryOrderDetailsScreen /></ProtectedRoute>} />

          {/* Admin Portal Routes */}
          <Route path="/admin/login" element={<AdminLoginScreen />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboardScreen /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminCategoriesScreen /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminProductsScreen /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminOrdersScreen /></ProtectedRoute>} />
          <Route path="/admin/partners" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminPartnersScreen /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminReportsScreen /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
