import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Dashboard from "./pages/restaurant/Dashboard";
import AddFood from "./pages/restaurant/AddFood";
import MyListings from "./pages/restaurant/MyListings";
import EditFood from "./pages/restaurant/EditFood";
import Requests from "./pages/restaurant/Requests";

import Dahboard from "./pages/ngo/Dashboard";
import AvailableFoods from "./pages/ngo/AvailableFoods";
import MyRequests from "./pages/ngo/MyRequests";
import RequestDetails from "./pages/ngo/RequestDetails";
function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/restaurant/dashboard" element={<Dashboard />} />
        <Route path="/restaurant/add-food" element={<AddFood />} />
        <Route path="/restaurant/my-listings" element={<MyListings />} />
        <Route path="/restaurant/edit-food/:id" element={<EditFood />} />
        <Route path="/restaurant/requests" element={<Requests />} />

        <Route path="/ngo/dashboard" element={<Dahboard />} />
        <Route path="/ngo/available-food" element={<AvailableFoods />} />
        <Route path="/ngo/my-requests" element={<MyRequests />} />
        <Route path="/ngo/request/:id" element={<RequestDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
