import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Link } from "react-router-dom";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/requests/restaurant");
      setRequests(res.data.requests);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      const res = await api.put(`/requests/${id}/accept`);

      toast.success(res.data.message);

      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await api.put(`/requests/${id}/reject`);

      toast.success(res.data.message);

      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await api.put(`/requests/${id}/complete`);

      toast.success(res.data.message);

      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Food Requests</h1>

      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-bold">{request.food.foodName}</h2>

              <p>
                <strong>NGO :</strong> {request.ngo.name}
              </p>

              <p>
                <strong>Email :</strong> {request.ngo.email}
              </p>

              <p>
                <strong>Phone :</strong> {request.ngo.phone}
              </p>

              <p>
                <strong>Quantity :</strong> {request.food.quantity}
              </p>

              <p>
                <strong>Food Type :</strong> {request.food.foodType}
              </p>

              <p>
                <strong>Status :</strong> {request.status}
              </p>

              <p>
                <strong>Message :</strong> {request.message || "No message"}
              </p>

              <div className="flex gap-3 mt-5">
                {request.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleAccept(request._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleReject(request._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}

                {request.status === "Accepted" && (
                  <>
                    <button
                      onClick={() => handleComplete(request._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Complete Pickup
                    </button>

                    <Link
                      to={`/chat/${request._id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      💬 Chat
                    </Link>
                  </>
                )}

                {request.status === "Rejected" && (
                  <span className="text-red-600 font-semibold">
                    Request Rejected
                  </span>
                )}

                {request.status === "Completed" && (
                  <span className="text-green-600 font-semibold">
                    Pickup Completed ✅
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
