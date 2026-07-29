import { useEffect, useState } from "react";
import { Package, ClipboardList,Clock, CheckCircle,BadgeCheck,XCircle } from "lucide-react";
import toast from "react-hot-toast";
import StatCard from "../../components/dashboard/StatCard";

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

 const stats = [
  {
    title: "Available Foods",
    value: dashboard?.availableFoods ?? foods.length,
    color: "text-green-600",
    icon: Package,
  },
  {
    title: "Total Requests",
    value: dashboard?.totalRequests || 0,
    color: "text-blue-600",
    icon: ClipboardList,
  },
  {
    title: "Pending Requests",
    value: dashboard?.pendingRequests || 0,
    color: "text-yellow-500",
    icon: Clock,
  },
  {
    title: "Accepted Requests",
    value: dashboard?.acceptedRequests || 0,
    color: "text-green-600",
    icon: CheckCircle,
  },
  {
    title: "Rejected Requests",
    value: dashboard?.rejectedRequests || 0,
    color: "text-red-600",
    icon: XCircle,
  },
  {
    title: "Completed Requests",
    value: dashboard?.completedRequests || 0,
    color: "text-purple-600",
    icon: BadgeCheck,
  },
];

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-8">
        NGO Dashboard
      </h1>

      {/* Stats */}

<div className="grid md:grid-cols-3 gap-6">

  {stats.map((stat) => (
    <StatCard
      key={stat.title}
      title={stat.title}
      value={stat.value}
      color={stat.color}
      icon={stat.icon}
    />
  ))}

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