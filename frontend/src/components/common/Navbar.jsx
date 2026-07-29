import { useAuth } from "../../context/AuthContext";
import { Menu } from "lucide-react";

const Navbar = ({ setIsSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
          <Menu size={28} />
        </button>

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name}
          </h2>

          <p className="text-gray-500 text-sm">
            Let's reduce food waste together 🌱
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            user?.role === "restaurant"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {user?.role?.toUpperCase()}
        </span>

        <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
