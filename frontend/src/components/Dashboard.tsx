import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import Clock from "./TinyComponents/Clock";
import CurrentDate from "./TinyComponents/CurrentDate";
import Weather from "./TinyComponents/Weather";
import Quotes from "./Quotes";
import ToDoWidget from "./ToDo/ToDoWidget";

interface DashboardProps {
  setTitle: (title: string) => void;
}

const Dashboard = ({ setTitle }: DashboardProps) => {
  // Get the authenticated user from Redux store
  const { user } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  // Use user.name if available, otherwise fallback
  const displayName = user?.name || "Guest";

  useEffect(() => {
    setTitle(`${displayName}'s Dashboard`);
    console.log("User Role: " + user?.role);
  }, [displayName, setTitle, user?.role]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 11) return "Guten Morgen";
    if (hour < 18) return "Guten Tag";
    return "Guten Abend";
  }, []);

  return (
    <div className="bg-[rgba(15,23,52,0.6)] rounded-xl p-6 m-4 text-gray-200 border border-gray-700 shadow-2xl">
      {/* Header: Greeting and Time Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-700/50 gap-4">
        <div className="flex flex-col gap-0.5 items-start">
          <p className="lg:text-3xl md:text-2xl xl:text-3xl xxl:text-4xl text-gray-200 uppercase tracking-wide font-bold flex items-center gap-2">
            {greeting},{" "}
            <span className="font-bold text-cyan-400">{displayName}</span>!
          </p>
          <p className="text-gray-400 text-[14px] uppercase tracking-wide pl-1 pt-0.5">
            Hier ist deine Übersicht für heute:
          </p>
        </div>

        {/* Much helpful Date and Time Widget */}
        <div className="flex items-center gap-3 bg-gray-900/40 px-4 py-2 rounded-lg border border-gray-700 shadow-[0px_0px_18px_rgba(40,220,240,0.2)]">
          <CurrentDate />
          <span className="text-gray-500">|</span>
          <div className="text-cyan-400 font-mono font-bold tracking-wider">
            <Clock />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Fancy and cute Weather Module */}
        <div className="lg:col-span-7 xl:col-span-8 bg-gray-800/50 p-4 rounded-xl border border-gray-600/70 shadow-[0px_0px_18px_rgba(0,0,0,0.4)]">
          <Weather />
        </div>

        {/* Sidebar: ToDos, Quotes and Admin Button */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Very motivational Quotes Widget */}
          <Quotes />

          {/* Very useful ToDo Widget */}
          <ToDoWidget />

          {/* Fancy admin Management Button */}
          <div className="space-y-4">
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/useroverview")}
                className="w-full py-3 bg-cyan-600/10 hover:bg-cyan-600 text-cyan-400 hover:text-white border border-cyan-600/30 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-cyan-900/20 cursor-pointer"
              >
                <span>Admin Management</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
