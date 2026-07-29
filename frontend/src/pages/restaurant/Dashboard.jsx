import { useEffect, useState } from "react";
import { 
    Package,
    CheckCircle,
    Clock,
    Truck,
    XCircle
} from "lucide-react";

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


    const statCards = [
        {
            title: "Total Food",
            value: stats?.totalFoods ?? 0,
            color: "text-blue-600",
            icon: Package
        },
        {
            title: "Available",
            value: stats?.availableFoods ?? 0,
            color: "text-green-600",
            icon: CheckCircle
        },
        {
            title: "Requested",
            value: stats?.requestedFoods ?? 0,
            color: "text-yellow-600",
            icon: Clock
        },
        {
            title: "Picked Up",
            value: stats?.pickedUpFoods ?? 0,
            color: "text-purple-600",
            icon: Truck
        },
        {
            title: "Expired",
            value: stats?.expiredFoods ?? 0,
            color: "text-red-600",
            icon: XCircle
        }
    ];


    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Restaurant Dashboard
            </h1>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

                {statCards.map((stat)=>(
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        color={stat.color}
                        icon={stat.icon}
                    />
                ))}

            </div>


        </div>
    );
};

export default Dashboard;