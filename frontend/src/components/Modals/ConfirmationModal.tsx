interface ChangeUserDataModalProps {
  onConfirm: () => void;
  toggleModal: () => void;
  confirmText: string;
  confirmButtonText: string;
}

const ConfirmationModal = ({
  onConfirm: onConfirm,
  toggleModal,
  confirmText,
  confirmButtonText,
}: ChangeUserDataModalProps) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-2 flex flex-col gap-4 bg-gray-800 border-2 border-red-500/60 rounded-lg z-40 p-4 w-120 h-auto">
      <p className="font-bold border-b border-red-600 pb-2 text-white text-2xl">
        Sind Sie sich sicher?
      </p>
      <p className="font-bold text-white">{`${confirmText}`}</p>
      <div className="flex flex-row justify-between gap-2">
        <button
          className="bg-red-600 hover:bg-red-500 transition-all duration-200 text-gray-200 rounded-md px-4 py-3 w-70 cursor-pointer"
          onClick={onConfirm}
        >
          {confirmButtonText}
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

export default ConfirmationModal;
