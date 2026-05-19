import type { User } from "../../types/User";
import { useState } from "react";

interface DeleteUserConfirmModalProps {
  onConfirm: (mailConfirmed: boolean) => void;
  toggleModal: () => void;
  user: User | null;
}

const DeleteUserConfirmModal = ({
  onConfirm: onConfirm,
  toggleModal,
  user,
}: DeleteUserConfirmModalProps) => {
  const [confirmMail, setConfirmMail] = useState("");

  const userMailEntered: boolean =
    confirmMail.trim().toLowerCase() === user?.email?.trim().toLowerCase();

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-2 flex flex-col gap-4 bg-gray-800 border-2 border-red-500/60 rounded-lg z-40 p-4 w-120 h-auto">
      <p className="font-bold border-b border-red-600 pb-2 text-white text-2xl">
        Sind Sie sich sicher?
      </p>
      <div className="flex flex-col space-y-2">
        <p className="font-bold text-white">{`Wollen Sie, ${user?.name} ${user?.surname}, Ihren Account wirklich löschen?`}</p>
        <p className="font-semibold text-white">{`Falls ja, geben Sie Ihre Email zur Bestätigung unten ein: `}</p>
      </div>
      <input
        type="text"
        className={`text-gray-300 p-2 border ${
          userMailEntered ? "border-red-500" : "border-red-300"
        } outline-none rounded-md`}
        placeholder="Confirm Email..."
        value={confirmMail}
        onChange={(e) => setConfirmMail(e.target.value)}
      />
      <div className="flex flex-row justify-between gap-2">
        <button
          className={`transition-all duration-200 text-gray-200 rounded-md px-4 py-3 w-70 cursor-pointer ${
            userMailEntered
              ? "bg-red-600 hover:bg-red-500"
              : "bg-red-600/10 hover:bg-red-500/20"
          }`}
          disabled={!userMailEntered}
          onClick={() => onConfirm(userMailEntered)}
        >
          {"Ja, Account löschen!"}
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-400 transition-all duration-200 text-gray-200 rounded-md px-4 py-3 w-70 cursor-pointer"
          onClick={toggleModal}
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
};

export default DeleteUserConfirmModal;
