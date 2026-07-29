import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/requests/my-requests");
      setRequests(res.data.requests);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Requests</h1>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-xl font-semibold">No Requests Found</h2>
          <p className="text-gray-500 mt-2">
            You haven't requested any food yet.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {requests.map((request) => (
            <div key={request._id} className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">
                    {request.food?.foodName}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    Restaurant: {request.restaurant?.name}
                  </p>

                  <p className="text-gray-600">
                    Quantity: {request.food?.quantity}
                  </p>

                  <p className="text-gray-600">
                    Food Type: {request.food?.foodType}
                  </p>

                  <p className="text-gray-600">
                    <strong>Pickup Address:</strong>{" "}
                    {request.food?.pickupAddress.address}
                  </p>

                  <p className="text-gray-500 text-sm mt-2">
                    Requested On: {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                    request.status,
                  )}`}
                >
                  {request.status}
                </span>
              </div>

              <div className="mt-5 flex gap-3">
                <Link
                  to={`/ngo/request/${request._id}`}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                  View Details
                </Link>

                {request.status === "Accepted" && (
                  <>
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps?q=${request.food?.pickupAddress?.latitude},${request.food?.pickupAddress?.longitude}`,
                          "_blank",
                        )
                      }
                      className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                    >
                      📍 Open Map
                    </button>

                    <Link
                      to={`/chat/${request._id}`}
                      className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700"
                    >
                      💬 Chat
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
