import { useNavigate } from "react-router";
import type { ToDoListItem } from "../../types/ToDoListItem";
import DeleteIcon from "../../assets/icons/delete.svg";

interface Props {
  listItem: ToDoListItem;
  handleDelete: (id: number) => void;
  stats: {
    total: number;
    totalCompleted: number;
    totalPending: number;
    p1: number;
    p2: number;
    p3: number;
    p4: number;
    p5: number;
  };
}

const ToDoListItemComp = ({ listItem, handleDelete, stats }: Props) => {
  const navigate = useNavigate();

  const handleListItemClick = (id: number) => {
    navigate(`/todo/${id}`);
  };

  // Helper for priority dot colors
  const getDotColor = (p: number) => {
    const colors: Record<number, string> = {
      1: "bg-gray-400",
      2: "bg-green-500",
      3: "bg-blue-500",
      4: "bg-orange-500",
      5: "bg-red-500",
    };
    return colors[p];
  };

  return (
    <div
      onClick={() => handleListItemClick(listItem.id)}
      className="group h-full bg-gray-800/40 backdrop-blur-md border border-gray-700 p-5 rounded-2xl cursor-pointer hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-2 bg-white/3 rounded-xl p-4">
          <div className="overflow-hidden">
            <p className="text-lg font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
              {listItem.title}
            </p>
            <p className="text-[12px] text-gray-500 font-bold uppercase tracking-wider mt-1">
              [ {stats.totalCompleted} / {stats.total} ] Aufgaben erledigt
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(listItem.id);
            }}
            className="p-2 bg-red-500/70 hover:bg-red-500/90 rounded-[9px] transition-all duration-200 cursor-pointer"
          >
            <img
              src={DeleteIcon}
              alt="Delete"
              title="Delete"
              className="min-w-4 min-h-4 w-4 h-4 invert"
            />
          </button>
        </div>
      </div>

      {/* Priority Dots Section */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-700/50">
        {[1, 2, 3, 4, 5].map((p) => {
          const count = stats[`p${p}` as keyof typeof stats] as number;
          return (
            <div
              key={p}
              className={`flex items-center justify-center min-w-7 h-7 px-1.5 rounded-lg text-[10px] font-black text-white shadow-sm transition-all ${getDotColor(p)} ${count === 0 ? "opacity-10 grayscale" : "opacity-100"}`}
            >
              {count}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ToDoListItemComp;
