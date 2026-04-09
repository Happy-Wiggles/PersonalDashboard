import { useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import type { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  addToDoToListAsync,
  deleteToDoAsync,
  fetchToDosByListIdAsync,
  updateToDoAsync,
} from "../../features/todos/ToDosSlice";
import {
  TrashIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import DropDownIcon from "../../assets/icons/dropdown.svg";
import type { ToDoItem } from "../../types/ToDoItem";

interface ToDoDetailsProps {
  setTitle: (title: string) => void;
}

const ToDoDetails = ({ setTitle }: ToDoDetailsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { listId } = useParams<{
    listId: string;
  }>();

  const {
    toDos,
    loading,
    error: stateError,
  } = useSelector((state: RootState) => state.todos);

  const currentList = useSelector((state: RootState) =>
    state.todos.toDoListItems.find((l) => l.id === Number(listId)),
  );

  const sortedToDos = useMemo(() => {
    if (!toDos) return [];

    // ToDos now splitted into two lists (completed and !completed))
    const openTasks = toDos.filter((t) => !t.completed);
    const completedTasks = toDos.filter((t) => t.completed);

    // Sort by priority first, then by ID (newest first)
    const sortByPrioAndId = (a: ToDoItem, b: ToDoItem) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }

      return b.id - a.id;
    };

    // Merge both lists into a completely new one
    return [
      ...openTasks.sort(sortByPrioAndId),
      ...completedTasks.sort(sortByPrioAndId),
    ];
  }, [toDos]);

  const [newTaskName, setNewTaskName] = useState<string>("");
  const [priority, setPriority] = useState<number>(2);

  useEffect(() => {
    if (listId) {
      dispatch(fetchToDosByListIdAsync(Number(listId)));
      setTitle(`ToDos: ${currentList?.title || "Unbekannte Liste"}`);
    }
  }, [dispatch, setTitle, listId, currentList]);

  const handleAddTask = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskName.trim() || !listId) return;

    try {
      await dispatch(
        addToDoToListAsync({
          toDoListId: Number(listId),
          toDoItem: { task: newTaskName, priority: priority },
        }),
      ).unwrap();
      setNewTaskName("");
      setPriority(2);
    } catch (error) {
      console.error("Failed to add task:", error, stateError);
    }
  };

  const handleCompletedChange = async (id: number, currentStatus: boolean) => {
    dispatch(
      updateToDoAsync({
        toDoId: id,
        data: { completed: !currentStatus },
      }),
    );
  };

  const getPriorityColor = (
    p: number,
    type: "bg" | "shadow" | "border" = "bg",
  ) => {
    const colors: Record<number, string> = {
      1: "rgba(150,150,150,0.6)", // Gray
      2: "rgba(34,197,94,0.6)", // Green
      3: "rgba(59,130,246,0.6)", // Blue
      4: "rgba(249,115,22,0.6)", // Orange
      5: "rgba(239,68,68,0.7)", // Red
    };
    const color = colors[p] || colors[1];
    if (type === "shadow") return `0px 0px 15px ${color}`;
    if (type === "border")
      return color.replace("0.6", "0.3").replace("0.7", "0.4");
    return color;
  };

  return (
    <div className="min-h-screen h-full p-4 md:p-8 space-y-8 bg-[#0f172a] text-gray-100">
      {/* Task Creation Section */}
      <section className="max-w-4xl mx-auto">
        <div className="flex flex-col bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-2xl gap-4">
          <p className="text-sm font-semibold text-cyan-400 uppercase tracking-[0.2em]">
            Neue Aufgabe hinzufügen
          </p>
          <form
            onSubmit={handleAddTask}
            className="flex flex-col lg:flex-row gap-4"
          >
            <input
              type="text"
              placeholder="Was steht an?"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="flex-1 bg-gray-900/50 border border-gray-600 p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
            />

            <div className="flex gap-3">
              {/* Styled Select Container */}
              <div className="relative group">
                <select
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  style={{ backgroundColor: getPriorityColor(priority) }}
                  className="appearance-none min-w-40 h-full border border-gray-600 p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none cursor-pointer text-sm font-bold text-white transition-all shadow-inner"
                >
                  <option value={1} className="bg-gray-800 text-gray-400">
                    Prio 1 - Niedrig
                  </option>
                  <option value={2} className="bg-gray-800 text-green-500">
                    Prio 2 - Normal
                  </option>
                  <option value={3} className="bg-gray-800 text-blue-500">
                    Prio 3 - Mittel
                  </option>
                  <option value={4} className="bg-gray-800 text-orange-500">
                    Prio 4 - Wichtig
                  </option>
                  <option value={5} className="bg-gray-800 text-red-500">
                    Prio 5 - Kritisch!
                  </option>
                </select>
                {/* Custom dropdown icon */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                  <img
                    src={DropDownIcon}
                    alt="Dropdown"
                    className="w-5 h-5 invert"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!newTaskName.trim()}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-cyan-900/20 cursor-pointer"
              >
                Hinzufügen
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ToDo Grid */}
      <section className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <ArrowPathIcon className="w-10 h-10 animate-spin text-cyan-400" />
          </div>
        ) : toDos.length === 0 ? (
          <div className="text-center p-20 bg-gray-800/10 rounded-3xl border-2 border-dashed border-gray-700">
            <p className="text-gray-500">
              Diese Liste ist noch leer. Zeit, produktiv zu werden!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedToDos.map((todo) => (
              <div
                key={todo.id}
                style={{
                  boxShadow: !todo.completed
                    ? getPriorityColor(todo.priority, "shadow")
                    : "none",
                  borderColor: getPriorityColor(todo.priority, "border"),
                }}
                className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 ${
                  todo.completed
                    ? "bg-gray-900/20 opacity-60 border-gray-800"
                    : "bg-gray-800/60 border-opacity-50 hover:bg-gray-800/80"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-[11px] font-black px-2 py-0.5 rounded uppercase text-gray-100 tracking-wider`}
                      style={{
                        backgroundColor: getPriorityColor(todo.priority),
                      }}
                    >
                      Prio {todo.priority}
                    </span>
                    {todo.completed ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : null}
                  </div>
                  <p
                    className={`text-lg h-full font-medium leading-tight wrap-break-word ${todo.completed ? "line-through text-gray-500" : "text-gray-100"}`}
                  >
                    {todo.task}
                  </p>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() =>
                      handleCompletedChange(todo.id, todo.completed)
                    }
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      todo.completed
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600 hover:text-white"
                    }`}
                  >
                    {todo.completed ? "Nicht erledigt" : "Erledigt"}
                  </button>
                  <button
                    onClick={() => dispatch(deleteToDoAsync(todo.id))}
                    className="p-2 bg-red-900/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ToDoDetails;
