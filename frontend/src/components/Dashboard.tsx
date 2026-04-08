import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import Clock from "./Clock";
import CurrentDate from "./CurrentDate";
import Weather from "./Weather";
import { useNavigate } from "react-router";
import Quotes from "./Quotes";

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
  }, [displayName, setTitle]);

  const getPriorityColor = (
    priority: number,
    isShadow: boolean = false,
  ): string => {
    if (isShadow) {
      switch (priority) {
        case 1:
          return "shadow-[0px_0px_10px_rgba(150,150,150,0.9)]";
        case 2:
          return "shadow-[0px_0px_10px_rgba(2,150,2,0.9)]";
        case 3:
          return "shadow-[0px_0px_10px_rgba(0,50,160,0.9)]";
        case 4:
          return "shadow-[0px_0px_10px_rgba(255,125,15,0.9)]";
        case 5:
          return "shadow-[0px_0px_10px_rgba(215,25,15,0.9)]";
        default:
          return "shadow-[0px_0px_10px_rgba(150,150,150,0.9)]";
      }
    } else {
      switch (priority) {
        case 1:
          return "bg-[rgba(150,150,150,0.9)]";
        case 2:
          return "bg-[rgba(2,150,2,0.6)]";
        case 3:
          return "bg-[rgba(0,50,160,0.6)]";
        case 4:
          return "bg-[rgba(255,125,15,0.6)]";
        case 5:
          return "bg-[rgba(215,25,15,0.6)]";
        default:
          return "bg-[rgba(150,150,150,0.9)]";
      }
    }
  };

  //const { allTodos } = useSelector((state: RootState) => state.todos);
  const [mockTodos] = useState([
    {
      id: 1,
      task: "Kritisches System-Update",
      priority: 5,
      listName: "Servers",
    },
    { id: 2, task: "Präsentation beenden", priority: 4, listName: "Arbeit" },
    {
      id: 3,
      task: "Dashboard CSS verfeinern",
      priority: 3,
      listName: "Coding",
    },
    {
      id: 4,
      task: "Versicherung anrufen",
      priority: 2,
      listName: "Private Sachen",
    },
    { id: 5, task: "Pflanzen gießen", priority: 1, listName: "Zuhause" },
  ]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 11) return "Guten Morgen";
    if (hour < 18) return "Guten Tag";
    return "Guten Abend";
  }, []);

  return (
    <div className="bg-gray-800 rounded-xl p-6 m-4 text-gray-200 border border-gray-700 shadow-2xl">
      {/* Header: Greeting and Time Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-700/50 gap-4">
        <div>
          <p className="text-2xl md:text-3xl text-white">
            {greeting},{" "}
            <span className="font-bold text-cyan-400">{displayName}</span>!
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Hier ist deine Übersicht für heute:
          </p>
        </div>

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
        {/* Weather Module */}
        <div className="lg:col-span-7 xl:col-span-8 bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 shadow-[0px_0px_18px_rgba(0,0,0,0.4)]">
          <Weather />
        </div>

        {/* Sidebar: ToDos & Admin Quick-Access */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <Quotes></Quotes>
          {/* ToDo Widget */}
          <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-700 shadow-[0px_0px_18px_rgba(0,0,0,0.4)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-100 text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                Wichtigste Aufgaben
              </h3>
              <button
                onClick={() => navigate("/todos")}
                className="text-[11px] text-cyan-400 hover:text-cyan-200 transition-colors uppercase font-bold cursor-pointer"
              >
                Alle anzeigen
              </button>
            </div>

            <div className="space-y-3">
              {mockTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center justify-between p-3 bg-gray-800/60 rounded-lg border border-gray-700/50 group hover:border-gray-500 transition-all cursor-pointer ${getPriorityColor(todo.priority, true)}`}
                  onClick={() => navigate("/todos")}
                >
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm text-gray-200 truncate group-hover:text-white transition-colors">
                      {todo.task}
                    </span>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">
                      Liste: {todo.listName}
                    </span>
                  </div>
                  <div
                    className={`ml-2 px-2 py-1 rounded text-[10px] font-black text-white ${getPriorityColor(todo.priority)}`}
                  >
                    P{todo.priority}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin management button */}
          <div className="space-y-4">
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/users")}
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

    // <div className="bg-gray-800 p-4 m-2 grid rounded text-left">
    //   <div className="flex flex-row justify-between">
    //     <p className="text-white text-2xl mb-2 pb-4 text-left">
    //       Willkommen,{" "}
    //       <span className="font-bold text-cyan-400">{displayName}</span>!
    //     </p>
    //     <div className="flex flex-row gap-2 text-right">
    //       <CurrentDate></CurrentDate>
    //       <p className="font-semibold text-2xl text-gray-200"> - </p>
    //       <Clock></Clock>
    //     </div>
    //   </div>
    //   <div>
    //     <Weather></Weather>
    //     <p className="text-gray-300 pt-4 mt-4 text-center">
    //       Weitere Dashboard Features kommen bald...
    //     </p>
    //   </div>
    // </div>
  );
};

export default Dashboard;
