import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChangeUserDataModal from "./ChangeUserDataModal";
import type { User } from "../types/User";
import { updateUserAsync, deleteUserAsync } from "../features/users/UserSlice";
import type { RootState, AppDispatch } from "../store/store";
import ConfirmationModal from "./ConfirmationModal";
import { useNavigate } from "react-router";

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

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmDeletion, setShowConfirmDeletion] =
    useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const toggleDataChangeModal = () => {
    setShowModal(!showModal);
  };

  const toggleConfirmModal = () => {
    setShowConfirmDeletion(!showConfirmDeletion);
  };

  const onConfirmDeletion = () => {
    dispatch(deleteUserAsync(user?.id ?? ""));
    console.log("User has been deleted...");
    toggleConfirmModal();
    navigate("/login");
  };

  const onSubmitChanges = (user: User) => {
    dispatch(updateUserAsync(user));
    toggleDataChangeModal();
  };

  const formatDate = (date: string | undefined) => {
    if (date === undefined) {
      return new Date();
    }

    const dateObj = new Date(date);
    const formattedDate = new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(dateObj);

    return formattedDate;
  };

  return (
    <div>
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-30 transition-all duration-300"
          onClick={() => setShowModal(false)}
        />
      )}
      {showConfirmDeletion && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-31 transition-all duration-300"
          onClick={() => setShowConfirmDeletion(false)}
        />
      )}
      <div>
        {showModal && user != null ? (
          <ChangeUserDataModal
            toBeChangedUser={user}
            onSubmit={onSubmitChanges}
            toggleModal={toggleDataChangeModal}
          ></ChangeUserDataModal>
        ) : (
          ""
        )}
        {showConfirmDeletion ? (
          <ConfirmationModal
            onConfirm={onConfirmDeletion}
            confirmButtonText="Ja, Account löschen!"
            confirmText={`Wollen Sie, ${user?.name} ${user?.surname}, Ihren Account wirklich löschen?`}
            toggleModal={toggleConfirmModal}
          ></ConfirmationModal>
        ) : (
          ""
        )}
      </div>
      <div className="m-2 flex flex-col text-left w-120 bg-gray-800 p-4 rounded-lg">
        <div className="bg-gray-700 flex flex-col rounded-2xl p-4">
          <p className="text-gray-200 font-bold mt-4 text-2xl text-left">
            Dein Profil:
          </p>
          <div className="p-4 rounded mt-2 text-white">
            <div className="flex flex-row gap-2 justify-between border-b-cyan-400 rounded">
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
            <div className="flex flex-row gap-2 justify-between">
              <label className="font-semibold">Kontoerstellung:</label>
              <p>{formatDate(user?.createdAt).toString()}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4 mt-2 justify-between text-left">
          <button
            className="bg-cyan-600 hover:bg-cyan-500 transition-all duration-200 text-gray-200 rounded-md px-4 py-3 w-auto cursor-pointer"
            onClick={toggleDataChangeModal}
          >
            Nutzerdaten ändern
          </button>
          <button
            className="bg-red-600 hover:bg-red-500 transition-all duration-200 text-gray-200 rounded-md px-4 py-3 w-auto cursor-pointer"
            onClick={toggleConfirmModal}
          >
            Nutzerkonto löschen
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
