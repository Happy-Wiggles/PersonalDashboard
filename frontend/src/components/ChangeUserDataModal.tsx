import { useState } from "react";
import type { User } from "../types/User";

interface ChangeUserDataModalProps {
  toBeChangedUser: User;
  onSubmit: (changedUser: User) => void;
  toggleModal: () => void;
}

const ChangeUserDataModal = ({
  toBeChangedUser,
  onSubmit,
  toggleModal,
}: ChangeUserDataModalProps) => {
  const [theUser, setTheUser] = useState<User>(toBeChangedUser);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-2 flex flex-col gap-4 bg-gray-800 border-2 border-cyan-400 rounded-lg z-40 p-2 w-100">
      <p className="font-bold border-b border-white pb-2 text-white">
        Profildaten ändern:
      </p>
      <input
        type="text"
        value={theUser.name}
        onChange={(e) => setTheUser({ ...theUser, name: e.target.value })}
        className="bg-gray-600 text-gray-200 placeholder:text-gray-400 border border-cyan-400 rounded-md p-2"
        placeholder="Vorname"
      />
      <input
        type="text"
        value={theUser.surname}
        onChange={(e) => setTheUser({ ...theUser, surname: e.target.value })}
        className="bg-gray-600 text-gray-200 placeholder:text-gray-400 border border-cyan-400 rounded-md p-2"
        placeholder="Nachname"
      />
      <input
        type="email"
        value={theUser.email}
        onChange={(e) => setTheUser({ ...theUser, email: e.target.value })}
        className="bg-gray-600 text-gray-200 placeholder:text-gray-400 border border-cyan-400 rounded-md p-2"
        placeholder="Email"
      />
      <div className="flex flex-row justify-between gap-2">
        <button
          className="bg-cyan-600 hover:bg-cyan-500 transition-all duration-200 text-gray-200 rounded-md px-4 py-3 w-70 cursor-pointer"
          onClick={() => onSubmit(theUser)}
        >
          Speichern
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

export default ChangeUserDataModal;
