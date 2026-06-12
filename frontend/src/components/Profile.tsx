import { useEffect, useState } from "react";
import type { RootState, AppDispatch } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { updateUserAsync, deleteUserAsync } from "../features/users/UserSlice";
import DeleteUserConfirmModal from "./Modals/DeleteUserConfirmModal";
import {
  KeyIcon,
  UserIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

import PasswordSection from "./Register/PasswordSection";
import { useNavigate } from "react-router";

interface DashboardProps {
  setTitle: (title: string) => void;
}

const Profile = ({ setTitle }: DashboardProps) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const displayName = user?.name || "Guest";

  useEffect(() => {
    setTitle(`${displayName}'s Infos`);
  }, [displayName, setTitle]);

  const [isEditingData, setIsEditingData] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    username: user?.username || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [showConfirmDeletion, setShowConfirmDeletion] =
    useState<boolean>(false);

  const handleSaveData = () => {
    if (!user) return;
    dispatch(updateUserAsync({ ...user, ...editForm }));
    setIsEditingData(false);
  };

  const isNewPasswordValid = validatePassword(passwordForm.newPassword);

  const handlePasswordSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    // dispatch(changePasswordAsync()) => also compare old hash of the current pw and new hash within that func
    console.log("Passwort wird geändert:", passwordForm.newPassword);
    setPasswordForm({ currentPassword: "", newPassword: "" });
  };

  const onConfirmDeletion = (mailConfirmed: boolean) => {
    if (!mailConfirmed) return;
    dispatch(deleteUserAsync(user?.id ?? ""));
    setShowConfirmDeletion(false);
    navigate("/login");
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 pb-12">
      {/* Confirm Delete Modal */}
      {showConfirmDeletion && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            onClick={() => setShowConfirmDeletion(false)}
          />
          <DeleteUserConfirmModal
            onConfirm={onConfirmDeletion}
            toggleModal={() => setShowConfirmDeletion(false)}
            user={user}
          />
        </>
      )}

      {/* Main Grid (1 col on mobile, 3 on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left side: User data */}
        <div className="md:col-span-1 bg-gray-800/60 rounded-2xl border border-gray-700 p-6 shadow-xl shadow-cyan-950/20 backdrop-blur-xs">
          <div className="flex items-center gap-3 border-b border-gray-700 pb-4 mb-4">
            <UserIcon className="w-6 h-6 text-cyan-400" />
            <p className="mt-4 text-2xl text-left font-black tracking-normal bg-linear-to-r from-green-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
              Dein Profil:
            </p>
          </div>

          <div className="space-y-4 text-gray-300">
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase block mb-1">
                E-Mail
              </label>
              <p className="bg-gray-900/40 p-2.5 rounded-xl border border-gray-700/50 text-gray-400">
                {user?.email}
              </p>
            </div>

            {isEditingData ? (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <label className="text-xs text-cyan-400 font-semibold uppercase block mb-1">
                    Benutzername
                  </label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm({ ...editForm, username: e.target.value })
                    }
                    className="w-full bg-gray-900/80 border border-cyan-500/50 rounded-xl p-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-cyan-400 font-semibold uppercase block mb-1">
                      Vorname
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full bg-gray-900/80 border border-cyan-500/50 rounded-xl p-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cyan-400 font-semibold uppercase block mb-1">
                      Nachname
                    </label>
                    <input
                      type="text"
                      value={editForm.surname}
                      onChange={(e) =>
                        setEditForm({ ...editForm, surname: e.target.value })
                      }
                      className="w-full bg-gray-900/80 border border-cyan-500/50 rounded-xl p-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveData}
                    className="w-1/2 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg text-sm transition-all cursor-pointer"
                  >
                    Speichern
                  </button>
                  <button
                    onClick={() => setIsEditingData(false)}
                    className="w-1/2 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 rounded-lg text-sm transition-all cursor-pointer"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase block mb-1">
                    Benutzername
                  </label>
                  <p className="text-white font-medium pl-1">
                    {user?.username}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase block mb-1">
                    Name
                  </label>
                  <p className="text-white font-medium pl-1">
                    {user?.name} {user?.surname}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase block mb-1">
                    Kontoerstellung
                  </label>
                  <p className="text-gray-400 text-sm pl-1">
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditingData(true)}
                  className="w-full mt-2 bg-cyan-600/30 border border-cyan-500/50 hover:bg-cyan-600/50 text-cyan-300 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                >
                  Daten bearbeiten
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Security and danger zone */}
        <div className="md:col-span-2 space-y-6">
          {/* Change password */}
          <div className="relative bg-gray-800/60 rounded-2xl border border-gray-700 p-6 shadow-xl shadow-cyan-950/20 backdrop-blur-xs">
            <div className="absolute inset-0 bg-gray-800/40 backdrop-blur-[1px] rounded-2xl z-10 flex items-center justify-center select-none">
              <div className="bg-cyan-500/10 border border-cyan-500/40 text-amber-cyan px-4 py-2 rounded-xl text-lg font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.1)] animate-pulse">
                Feature in Arbeit...
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-gray-700 pb-4 mb-4">
              <KeyIcon className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-gray-200 uppercase tracking-wide">
                Sicherheit
              </h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="flex flex-col space-y-4">
                {/* Current Password */}
                <div>
                  <label className="text-xs text-gray-400 font-semibold uppercase block mb-1">
                    Aktuelles Passwort
                  </label>
                  <div className="relative w-full">
                    <PasswordSection
                      incPassword={passwordForm.currentPassword}
                      onChange={(val) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: val,
                        }))
                      }
                      isCurrentPasswordField={true}
                    />
                  </div>
                </div>
                {/* New Password */}
                <div>
                  <label className="text-xs text-gray-400 font-semibold uppercase block mb-1">
                    Neues Passwort
                  </label>
                  <div className="relative w-full">
                    <PasswordSection
                      incPassword={passwordForm.newPassword}
                      onChange={(val) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: val,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="bg-yellow-600/20 border border-yellow-500/40 hover:bg-yellow-600/40 text-yellow-300 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!isNewPasswordValid}
              >
                Passwort aktualisieren
              </button>
            </form>
          </div>

          {/* Third: DANGER ZONE */}
          <div className="bg-red-950/20 rounded-2xl border border-red-900/40 p-6 shadow-xl backdrop-blur-xs">
            <div className="flex items-center gap-3 border-b border-red-900/30 pb-4 mb-3">
              <ShieldExclamationIcon className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-bold text-red-400 uppercase tracking-wide">
                Danger Zone
              </h2>
            </div>
            <p className="text-sm text-red-300/80 mb-4 leading-relaxed">
              Das Löschen deines Kontos ist endgültig. Alle Daten werden
              unwiderruflich von unseren Servern entfernt.
            </p>
            <button
              onClick={() => setShowConfirmDeletion(true)}
              className="bg-red-600/20 border border-red-500/50 hover:bg-red-600/40 text-red-400 px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer mt-5"
            >
              Konto dauerhaft löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const validatePassword = (pw: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pw);

export default Profile;
