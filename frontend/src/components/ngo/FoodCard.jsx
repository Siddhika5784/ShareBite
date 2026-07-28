import React from "react";

const FoodCard = ({ food, onRequest,userLocation }) => {

    console.log("Food:", food);
  console.log("Pickup:", food.pickupAddress);
  console.log("User Location:", userLocation);
  

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img
        src={food.image}
        alt={food.foodName}
        className="w-full h-52 object-cover"
      />

      <div className="p-5">
        <h2 className="text-2xl font-bold mb-2">{food.foodName}</h2>

        <p className="text-gray-600 mb-4">{food.description}</p>

        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Quantity:</span> {food.quantity}
          </p>

          <p>
            <span className="font-semibold">Food Type:</span> {food.foodType}
          </p>

          <p>
            <span className="font-semibold">Restaurant:</span>{" "}
            {food.restaurant?.name}
          </p>

          <p>
            <span className="font-semibold">Phone:</span>{" "}
            {food.restaurant?.phone}
          </p>

          <p>
            <span className="font-semibold">Pickup:</span> {food.pickupAddress?.address}
          </p>

            {
  userLocation &&
  food.pickupAddress?.latitude &&
  food.pickupAddress?.longitude && (
    <p className="text-sm text-blue-600 font-medium mt-2">
      📍{" "}
      {calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        food.pickupAddress.latitude,
        food.pickupAddress.longitude
      )}{" "} km away
    </p>
  )}
            <p>
            <span className="font-semibold">Expiry:</span>{" "}
            {new Date(food.expiryTime).toLocaleString()}
          </p>
        </div>

        <button
          disabled={food.status !== "Available"}
          onClick={() => onRequest(food._id)}
          className={`mt-5 w-full py-2 rounded-lg text-white transition ${
            food.status === "Available"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {food.status === "Available" ? "Request Food" : "Already Requested"}
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
