import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import FoodCard from "../../components/ngo/FoodCard";

const AvailableFoods = () => {
  const [foods, setFoods] = useState([]);
  const [foodType, setFoodType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetchFoods();
  }, []);
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation is not supported");
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        toast.success("Current location detected");
      },
      () => {
        toast.error("Unable to fetch your location");
      },
    );
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
  
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
  
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
  };
  const fetchFoods = async () => {
    try {
      const res = await api.get("/foods");

      setFoods(res.data.foods);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch foods");
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (foodId) => {
    try {
      const res = await api.post("/requests", {
        foodId,
      });

      toast.success(res.data.message);

      // Refresh available foods
      fetchFoods();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  };
  if (loading) {
    return <LoadingSpinner />;
  }

 let filteredFoods =
  foodType === "All"
    ? [...foods]
    : foods.filter((food) => food.foodType === foodType);

if (userLocation && sortBy === "nearest") {
  filteredFoods.sort((a, b) => {
    const d1 = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      a.pickupAddress.latitude,
      a.pickupAddress.longitude
    );

    const d2 = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      b.pickupAddress.latitude,
      b.pickupAddress.longitude
    );

    return d1 - d2;
  });
}
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Available Foods</h1>

      <div className="flex gap-3 mb-6">
        {["All", "Veg", "Non-Veg"].map((type) => (
          <button
            key={type}
            onClick={() => setFoodType(type)}
            className={`px-5 py-2 rounded-lg transition font-medium ${
              foodType === type
                ? "bg-green-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      <button
        onClick={getCurrentLocation}
        className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-500 mb-3"
      >
        📍 Enable Location to See Nearby Food
      </button>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="border rounded-lg px-4 py-2 m-1"
      >
        <option value="default">Default</option>
        <option value="nearest">Nearest First</option>
      </select>

      {filteredFoods.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          No {foodType !== "All" ? foodType : ""} food available right now.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
              onRequest={handleRequest}
              userLocation={userLocation}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableFoods;
