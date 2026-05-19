import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { useNavigate } from "react-router";
import type { User } from "../types/User";
import {
  fetchUsersAsync,
  updateUserAsync,
  deleteUserAsync,
} from "../features/users/UserSlice";
import DeleteUserConfirmModal from "./Modals/DeleteUserConfirmModal";
import ChangeUserDataModalFull from "./Modals/ChangeUserDataModalFull";
import EditIcon from "../assets/icons/edit.svg";
import DeleteIcon from "../assets/icons/delete.svg";

interface UserOverviewProps {
  setTitle: (title: string) => void;
}

const UserOverview = ({ setTitle }: UserOverviewProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAdmin, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmDeletion, setShowConfirmDeletion] =
    useState<boolean>(false);

  useEffect(() => {
    setTitle("Benutzerverwaltung");
    if (!isAdmin || !isAuthenticated) {
      navigate("/dashboard");
      return;
    }

    const loadUsers = async () => {
      const response = await dispatch(fetchUsersAsync());
      if (response.payload) setUsers(response.payload as User[]);
    };
    loadUsers();
  }, [isAdmin, isAuthenticated, navigate, dispatch, setTitle]);

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

  const toggleDataChangeModal = (userS: User | null) => {
    if (userS) setSelectedUser(userS);

    setShowModal(!showModal);
  };

  const toggleConfirmModal = (userId: string | null) => {
    if (userId === null) {
      setSelectedUser(null);
    } else {
      const user = users.find((u) => u.id === userId);
      if (user) {
        setSelectedUser(user);
      }
    }
    setShowConfirmDeletion(!showConfirmDeletion);
  };

  const onSubmitChanges = (user: User) => {
    dispatch(updateUserAsync(user));
    toggleDataChangeModal(null);
  };

  const onConfirmDeletion = () => {
    console.log("Deleting user with ID:", selectedUser?.id);
    dispatch(deleteUserAsync(selectedUser?.id ?? ""));
    setUsers(users.filter((u) => u.id !== selectedUser?.id));
    toggleConfirmModal(null);
  };

  return (
    <div className="p-6">
      {(showModal || showConfirmDeletion) && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-30 transition-all duration-300"
          onClick={() => setShowModal(false)}
        />
      )}
      <div>
        {showModal && selectedUser != null ? (
          <ChangeUserDataModalFull
            toBeChangedUser={selectedUser!}
            onSubmit={() => onSubmitChanges(selectedUser!)}
            toggleModal={() => toggleDataChangeModal(null)}
          ></ChangeUserDataModalFull>
        ) : (
          ""
        )}
        {showConfirmDeletion ? (
          <DeleteUserConfirmModal
            onConfirm={onConfirmDeletion}
            toggleModal={() => toggleConfirmModal(null)}
            user={selectedUser}
          ></DeleteUserConfirmModal>
        ) : (
          ""
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="group relative bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:bg-gray-800 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-900/10"
          >
            {/* Header: Username & Role */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-row items-center gap-2">
                <span className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  {user.username}
                </span>
                <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                  ( {user.role === "admin" ? "Admin" : "User"} )
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => toggleDataChangeModal(user)}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-cyan-600 transition-colors cursor-pointer"
                >
                  <img src={EditIcon} alt="Edit" className="w-5 h-5 invert" />
                </button>
                <button
                  onClick={() => toggleConfirmModal(user.id)}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-red-600 transition-colors cursor-pointer"
                >
                  <img
                    src={DeleteIcon}
                    alt="Delete"
                    className="w-5 h-5 invert"
                  />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-16 font-medium text-gray-500">Name:</span>
                <span className="text-gray-200">
                  {user.name} {user.surname}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-16 font-medium text-gray-500">Email:</span>
                <span className="text-gray-200 truncate">{user.email}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-between items-center text-[14px] text-gray-500 italic">
              <span>ID: {user.id}</span>
              <span>Seit: {formatDate(user.createdAt).toString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOverview;
