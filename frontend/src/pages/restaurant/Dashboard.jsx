import { useEffect, useState } from "react";
import api from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatCard from "../../components/dashboard/StatCard";
import toast from "react-hot-toast";

const Dashboard = () => {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {

        try {

            const res = await api.get("/dashboard/restaurant");

            setStats(res.data.dashboard);

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

    return (
        <div>

            <h1 className="text-3xl font-bold mb-6">
                Restaurant Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

                <StatCard
                    title="Total Food"
                    value={stats?.totalFoods}
                    color="text-blue-600"
                />

                <StatCard
                    title="Available"
                    value={stats?.availableFoods}
                    color="text-green-600"
                />

                <StatCard
                    title="Requested"
                    value={stats?.requestedFoods}
                    color="text-yellow-600"
                />

                <StatCard
                    title="Picked Up"
                    value={stats?.pickedUpFoods}
                    color="text-purple-600"
                />

                <StatCard
                    title="Expired"
                    value={stats?.expiredFoods}
                    color="text-red-600"
                />

            </div>

        </div>
    );
};

export default Dashboard;