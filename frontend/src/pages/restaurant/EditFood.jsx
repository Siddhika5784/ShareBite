import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    foodName: "",
    description: "",
    quantity: "",
    foodType: "Veg",
    expiryTime: "",
    pickupAddress: {
      address: "",
      latitude: "",
      longitude: "",
    },
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

        pickupAddress: {
          address: food.pickupAddress?.address || "",
          latitude: food.pickupAddress?.latitude || "",
          longitude: food.pickupAddress?.longitude || "",
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch food");
      navigate("/restaurant/my-listings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pickupAddress") {
      setFormData((prev) => ({
        ...prev,
        pickupAddress: {
          ...prev.pickupAddress,
          address: value,
        },
      }));
    } else if (name === "latitude" || name === "longitude") {
      setFormData((prev) => ({
        ...prev,
        pickupAddress: {
          ...prev.pickupAddress,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          pickupAddress: {
            ...prev.pickupAddress,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        }));

        toast.success("Location Updated");
      },
      () => {
        toast.error("Unable to fetch location");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      const payload = {
        foodName: formData.foodName,
        description: formData.description,
        quantity: Number(formData.quantity),
        foodType: formData.foodType,
        expiryTime: formData.expiryTime,

        pickupAddress: {
          address: formData.pickupAddress.address,
          latitude: Number(formData.pickupAddress.latitude),
          longitude: Number(formData.pickupAddress.longitude),
        },
      };

      const res = await api.put(`/foods/${id}`, payload);

      toast.success(res.data.message);

      navigate("/restaurant/my-listings");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update food");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

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
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
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
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Quantity */}

        <div>
          <label className="block mb-2 font-medium">
            Quantity
          </label>

          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
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
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
          >
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
        </div>

        {/* Expiry */}

        <div>
          <label className="block mb-2 font-medium">
            Expiry Time
          </label>

          <input
            type="datetime-local"
            name="expiryTime"
            value={formData.expiryTime}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Pickup Address */}

        <div>
          <label className="block mb-2 font-medium">
            Pickup Address
          </label>

          <textarea
            rows="3"
            name="pickupAddress"
            value={formData.pickupAddress.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
            required
          />

          <button
            type="button"
            onClick={getCurrentLocation}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            📍 Use Current Location
          </button>
        </div>

        {/* Latitude & Longitude */}

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="block mb-2 font-medium">
              Latitude
            </label>

            <input
              type="number"
              step="any"
              name="latitude"
              value={formData.pickupAddress.latitude}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Longitude
            </label>

            <input
              type="number"
              step="any"
              name="longitude"
              value={formData.pickupAddress.longitude}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

        </div>

        {/* Buttons */}

        <div className="flex gap-4">

          <button
            type="submit"
            disabled={updating}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Food"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/restaurant/my-listings")}
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>

        </div>

      </form>
    </div>
  );
};

export default EditFood;