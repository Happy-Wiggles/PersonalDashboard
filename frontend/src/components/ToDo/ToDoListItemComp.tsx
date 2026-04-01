import { useNavigate } from "react-router";
import type { ToDoListItem } from "../../types/ToDoListItem";

interface ToDoListItemProps {
  listItem: ToDoListItem;
  handleDelete: (id: number) => void;
}

const ToDoListItemComp = ({
  listItem: listItem,
  handleDelete,
}: ToDoListItemProps) => {
  const navigate = useNavigate();

  const handleListItemClick = (id: number) => {
    navigate(`/todo/${id}`);
  };

  return (
    <div
      key={listItem.id}
      className="relative group bg-gray-800 p-6 m-2 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-[rgba(0,217,255,0.2)] cursor-pointer transition duration-300"
      onClick={() => handleListItemClick(listItem.id)}
    >
      <div className="flex flex-row gap-2 items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">{listItem.title}</h3>
        </div>

        <button
          className="z-10 bg-red-700 text-gray-200 hover:bg-red-500 rounded-lg p-2 cursor-pointer transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(listItem.id);
          }}
        >
          Löschen
        </button>
      </div>
    </div>
  );
};

export default ToDoListItemComp;
