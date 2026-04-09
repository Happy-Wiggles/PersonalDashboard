import { useState } from "react";
import type { User } from "../../types/User";

interface ChangeUserDataModalProps {
  toBeChangedUser: User;
  onSubmit: (changedUser: User) => void;
  toggleModal: () => void;
}

const ChangeUserDataModalFull = ({
  toBeChangedUser,
  onSubmit,
  toggleModal,
}: ChangeUserDataModalProps) => {
  const [theUser, setTheUser] = useState<User>(toBeChangedUser);

  return (
    <div className="absolute flex flex-col gap-3 group top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800/50 border border-gray-600 rounded-xl transition-all duration-300 z-40 mt-6 p-5 w-120 h-auto">
      <p className="font-bold bg-white/10 px-2 py-3 rounded-lg text-gray-200 text-[22px] text-center tracking-wide uppercase">
        Profildaten ändern:
      </p>
      <input
        type="text"
        value={theUser.name}
        onChange={(e) => setTheUser({ ...theUser, name: e.target.value })}
        className="bg-gray-600 text-gray-200 placeholder:text-gray-400 border border-cyan-400/60 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
        placeholder="Vorname"
      />
      <input
        type="text"
        value={theUser.surname}
        onChange={(e) => setTheUser({ ...theUser, surname: e.target.value })}
        className="bg-gray-600 text-gray-200 placeholder:text-gray-400 border border-cyan-400/60 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
        placeholder="Nachname"
      />
      <input
        type="text"
        value={theUser.username}
        onChange={(e) => setTheUser({ ...theUser, username: e.target.value })}
        className="bg-gray-600 text-gray-200 placeholder:text-gray-400 border border-cyan-400/60 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
        placeholder="Benutzername"
      />
      <input
        type="email"
        value={theUser.email}
        onChange={(e) => setTheUser({ ...theUser, email: e.target.value })}
        className="bg-gray-600 text-gray-200 placeholder:text-gray-400 border border-cyan-400/60 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
        placeholder="E-Mail"
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

export default ChangeUserDataModalFull;
