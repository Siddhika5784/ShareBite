import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    foodName: "",
    description: "",
    quantity: "",
    foodType: "Veg",
    expiryTime: "",
    pickupAddress: "",
  });

  useEffect(() => {
    fetchFood();
  }, [id]);

  const fetchFood = async () => {
    try {
      const res = await api.get(`/foods/${id}`);

      const food = res.data.food;

      setFormData({
        foodName: food.foodName,
        description: food.description,
        quantity: food.quantity,
        foodType: food.foodType,
        expiryTime: food.expiryTime.slice(0, 16),
        pickupAddress: food.pickupAddress,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch food");
      navigate("/restaurant/my-listings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put(`/foods/${id}`, formData);

      toast.success(res.data.message);

      navigate("/restaurant/my-listings");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update food");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Edit Food
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

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
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
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
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            rows="3"
            value={formData.pickupAddress}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Update Food
          </button>

          <button
            type="button"
            onClick={() => navigate("/restaurant/my-listings")}
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditFood;