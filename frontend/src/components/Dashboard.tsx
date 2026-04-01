import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import Clock from "./Clock";
import CurrentDate from "./CurrentDate";
import Weather from "./Weather";

interface DashboardProps {
  setTitle: (title: string) => void;
}

const Dashboard = ({ setTitle }: DashboardProps) => {
  // Get the authenticated user from Redux store
  const { user } = useSelector((state: RootState) => state.auth);

  // Use user.name if available, otherwise fallback
  const displayName = user?.name || "Guest";

  useEffect(() => {
    setTitle(`${displayName}'s Dashboard`);
  }, [displayName, setTitle]);

  return (
    <div className="bg-gray-800 p-4 m-2 grid rounded text-left">
      <div className="flex flex-row justify-between">
        <p className="text-white text-2xl mb-2 pb-4 text-left">
          Willkommen,{" "}
          <span className="font-bold text-cyan-400">{displayName}</span>!
        </p>
        <div className="flex flex-row gap-2 text-right">
          <CurrentDate></CurrentDate>
          <p className="font-semibold text-2xl text-gray-200"> - </p>
          <Clock></Clock>
        </div>
      </div>
      <div>
        <Weather></Weather>
        <p className="text-gray-300 pt-4 mt-4 text-center">
          Weitere Dashboard Features kommen bald...
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
