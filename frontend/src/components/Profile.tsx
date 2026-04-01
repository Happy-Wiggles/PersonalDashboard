import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface DashboardProps {
  setTitle: (title: string) => void;
}

const Profile = ({ setTitle }: DashboardProps) => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Use user.name if available, otherwise fallback
  const displayName = user?.name || "Guest";

  useEffect(() => {
    setTitle(`${displayName}'s Infos`);
  }, [displayName, setTitle]);

  return (
    <div className="m-2">
      <div className="bg-gray-700 flex flex-col self-center w-70 rounded-2xl p-4">
        <p className="text-gray-200 font-bold mt-4 text-2xl text-left">
          Dein Profil:
        </p>
        <div className="p-4 rounded mt-2 text-white">
          <div className="flex flex-row gap-2 justify-between">
            <label className="font-semibold">Email:</label>
            <p>{user?.email}</p>
          </div>
          <div className="flex flex-row gap-2 justify-between">
            <label className="font-semibold">Benutzername:</label>
            <p>{user?.username}</p>
          </div>
          <div className="flex flex-row gap-2 justify-between">
            <label className="font-semibold">Name:</label>
            <p>
              {user?.name} {user?.surname}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
