import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import ChangeUserDataModal from "./ChangeUserDataModal";
import type { User } from "../types/User";

interface DashboardProps {
  setTitle: (title: string) => void;
}

const Profile = ({ setTitle }: DashboardProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showModal, setShowModal] = useState(false);

  // Use user.name if available, otherwise fallback
  const displayName = user?.name || "Guest";

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const onSubmitChanges = (user: User) => {
    console.log("Changes" + user);
  };

  useEffect(() => {
    setTitle(`${displayName}'s Infos`);
  }, [displayName, setTitle]);

  return (
    <div>
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-30 transition-all duration-300"
          onClick={() => setShowModal(false)}
        />
      )}
      <div>
        {showModal && user != null ? (
          <ChangeUserDataModal
            toBeChangedUser={user}
            onSubmit={onSubmitChanges}
            toggleModal={toggleModal}
          ></ChangeUserDataModal>
        ) : (
          ""
        )}
      </div>
      <div className="m-2 flex flex-col text-left">
        <div className="bg-gray-700 flex flex-col w-70 rounded-2xl p-4">
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
        <div className="mt-2 text-left">
          <button
            className="bg-cyan-600 hover:bg-cyan-500 transition-all duration-200 text-gray-200 rounded-md px-4 py-3 w-70 cursor-pointer"
            onClick={toggleModal}
          >
            Nutzerdaten ändern
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
