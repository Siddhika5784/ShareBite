import StatCard from "../../components/dashboard/StatCard";

const Dashboard = () => {

    const stats = [
        {
            title:"Total Food",
            value:12,
            color:"text-blue-600"
        },
        {
            title:"Available",
            value:8,
            color:"text-green-600"
        },
        {
            title:"Requested",
            value:2,
            color:"text-yellow-600"
        },
        {
            title:"Picked Up",
            value:1,
            color:"text-purple-600"
        },
        {
            title:"Expired",
            value:1,
            color:"text-red-600"
        }
    ];

    return (

        <div>

            <h1 className="text-3xl font-bold mb-6">
                Restaurant Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

                {stats.map((item)=>(
                    <StatCard
                        key={item.title}
                        title={item.title}
                        value={item.value}
                        color={item.color}
                    />
                ))}

            </div>

        </div>

    )

}

export default Dashboard;