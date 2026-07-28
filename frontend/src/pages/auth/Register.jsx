import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "ngo",
    address: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const { confirmPassword, ...payload } = formData;

      const res = await api.post("/auth/register", payload);

      toast.success(res.data.message || "Registration successful");

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">

        <h1 className="text-3xl font-bold text-center text-green-600">
          ShareBite
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Create your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Address
            </label>

            <textarea
              rows="3"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter complete address"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Register As
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="ngo">NGO</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <p className="text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;