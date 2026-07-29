import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  List,
  ClipboardList,
  Utensils,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const restaurantLinks = [
    {
      name: "Dashboard",
      path: "/restaurant/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Add Food",
      path: "/restaurant/add-food",
      icon: <PlusCircle size={20} />,
    },
    {
      name: "My Listings",
      path: "/restaurant/my-listings",
      icon: <List size={20} />,
    },
    {
      name: "Requests",
      path: "/restaurant/requests",
      icon: <ClipboardList size={20} />,
    },
  ];

  const ngoLinks = [
    {
      name: "Dashboard",
      path: "/ngo/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Available Food",
      path: "/ngo/available-food",
      icon: <Utensils size={20} />,
    },
    {
      name: "My Requests",
      path: "/ngo/my-requests",
      icon: <ClipboardList size={20} />,
    },
  ];

  const links = user?.role === "restaurant" ? restaurantLinks : ngoLinks;

  return (
    <div
      className={`fixed md:static top-0 left-0 z-50 h-full w-64 bg-green-700 text-white flex flex-col justify-between transform transition-transform duration-300
  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      <div>
        <h1 className="text-2xl font-bold p-6 border-b border-green-600">
          ShareBite
        </h1>

        <nav className="mt-6 flex flex-col gap-2 px-3">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
               onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-white text-green-700 font-semibold"
                    : "hover:bg-green-600"
                }`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-green-600">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-500 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
