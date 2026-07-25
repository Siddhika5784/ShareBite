import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const AddFood = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    foodName: "",
    description: "",
    quantity: "",
    foodType: "Veg",
    expiryTime: "",
    pickupAddress: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      return toast.error("Please select a food image");
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("foodName", formData.foodName);
      data.append("description", formData.description);
      data.append("quantity", formData.quantity);
      data.append("foodType", formData.foodType);
      data.append("expiryTime", formData.expiryTime);
      data.append("pickupAddress", formData.pickupAddress);
      data.append("image", image);

      const res = await api.post("/foods", data);

      toast.success(res.data.message || "Food added successfully");

      setFormData({
        foodName: "",
        description: "",
        quantity: "",
        foodType: "Veg",
        expiryTime: "",
        pickupAddress: "",
      });

      setImage(null);

      navigate("/restaurant/my-listings");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add food"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-6">

      <h1 className="text-3xl font-bold mb-6 text-center">
        Add Food
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Food Name */}
        <div>
          <label className="block mb-2 font-medium">
            Food Name
          </label>

          <input
            type="text"
            name="foodName"
            value={formData.foodName}
            onChange={handleChange}
            placeholder="Enter food name"
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Food description"
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block mb-2 font-medium">
            Quantity
          </label>

          <input
            type="text"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Example: 20 Plates"
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Food Type */}
        <div>
          <label className="block mb-2 font-medium">
            Food Type
          </label>

          <select
            name="foodType"
            value={formData.foodType}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
            <option value="Both">Both</option>
          </select>
        </div>

        {/* Expiry Time */}
        <div>
          <label className="block mb-2 font-medium">
            Expiry Time
          </label>

          <input
            type="datetime-local"
            name="expiryTime"
            value={formData.expiryTime}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Pickup Address */}
        <div>
          <label className="block mb-2 font-medium">
            Pickup Address
          </label>

          <textarea
            name="pickupAddress"
            value={formData.pickupAddress}
            onChange={handleChange}
            rows="3"
            placeholder="Enter pickup location"
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Food Image */}
        <div>
          <label className="block mb-2 font-medium">
            Food Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Adding Food..." : "Add Food"}
        </button>

      </form>
    </div>
  );
};

export default AddFood;