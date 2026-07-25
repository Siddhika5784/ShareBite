import { useEffect, useState } from "react";
import api from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyListings = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await api.get("/foods/my-foods");

      setFoods(res.data.foods);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch foods");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this food?",
    );

    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/foods/${id}`);

      toast.success(res.data.message);

      fetchFoods();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete food");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Listings</h1>

      {foods.length === 0 ? (
        <p>No food listings found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            <div
              key={food._id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={food.image}
                alt={food.foodName}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-semibold">{food.foodName}</h2>

                <p className="text-gray-600 mt-2">{food.description}</p>

                <p className="mt-3">
                  <strong>Quantity:</strong> {food.quantity}
                </p>

                <p>
                  <strong>Food Type:</strong> {food.foodType}
                </p>

                <p>
                  <strong>Status:</strong> {food.status}
                </p>

                <p>
                  <strong>Expiry:</strong>{" "}
                  {new Date(food.expiryTime).toLocaleString()}
                </p>

                <p>
                  <strong>Pickup:</strong> {food.pickupAddress}
                </p>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() =>
                      navigate(`/restaurant/edit-food/${food._id}`)
                    }
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(food._id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
