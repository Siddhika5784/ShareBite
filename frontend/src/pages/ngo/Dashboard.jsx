import { useEffect, useState } from "react";
import { Package, ClipboardList,Clock, CheckCircle,BadgeCheck,XCircle } from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [foods, setFoods] = useState([]);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

 const fetchDashboard = async () => {
  try {
    const [foodsRes, dashboardRes] = await Promise.all([
      api.get("/foods"),
      api.get("/dashboard/ngo"),
    ]);

    setFoods(foodsRes.data.foods);
    setDashboard(dashboardRes.data.dashboard);
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to load dashboard"
    );
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return <LoadingSpinner />;
  }

  const totalFoods = foods.length;

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-8">
        NGO Dashboard
      </h1>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">
                Available Foods
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {dashboard?.availableFoods ?? foods.length}
              </h2>
            </div>

            <Package className="text-green-600" size={40} />
          </div>
        </div>

         <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">
                Total Requests
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {dashboard?.totalRequests || 0}
              </h2>
            </div>

            <ClipboardList className="text-blue-600" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">
                Pending Requests
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {dashboard?.pendingRequests || 0}
              </h2>
            </div>

            <Clock className="text-yellow-500" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">
                Accepted Requests
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {dashboard?.acceptedRequests || 0}
              </h2>
            </div>

            <CheckCircle className="text-green-600" size={40} />
          </div>
        </div>

         <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">
                Rejected Requests
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {dashboard?.rejectedRequests || 0}
              </h2>
            </div>

            <XCircle className="text-red-600" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">
                Completed Requests
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {dashboard?.completedRequests || 0}
              </h2>
            </div>

            <BadgeCheck className="text-purple-600" size={40} />
          </div>
        </div>

      </div>

      {/* Recent Food Listings */}

      <div className="bg-white rounded-xl shadow mt-8 p-6">

        <h2 className="text-2xl font-semibold mb-5">
          Recently Available Foods
        </h2>

        {foods.length === 0 ? (
          <p className="text-gray-500">
            No food available.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-3">
                    Food
                  </th>

                  <th className="text-left py-3">
                    Restaurant
                  </th>

                  <th className="text-left py-3">
                    Quantity
                  </th>

                  <th className="text-left py-3">
                    Food Type
                  </th>

                  <th className="text-left py-3">
                    Expiry
                  </th>

                </tr>

              </thead>

              <tbody>

                {foods.slice(0, 5).map((food) => (

                  <tr
                    key={food._id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="py-4">
                      {food.foodName}
                    </td>

                    <td>
                      {food.restaurant?.name}
                    </td>

                    <td>
                      {food.quantity}
                    </td>

                    <td>
                      {food.foodType}
                    </td>

                    <td>
                      {new Date(food.expiryTime).toLocaleString()}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;