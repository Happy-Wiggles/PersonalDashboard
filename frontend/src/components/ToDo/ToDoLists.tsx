import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import {
  createToDoListAsync,
  deleteToDoListAsync,
  fetchToDoListsAsync,
  fetchAllUserToDosAsync,
} from "../../features/todos/ToDosSlice";
import ToDoListItemComp from "./ToDoListItemComp";

interface ToDoProps {
  setTitle: (title: string) => void;
}

const ToDoLists = ({ setTitle }: ToDoProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [newListTitle, setNewListTitle] = useState<string>("");

  const { toDoListItems, toDos, loading, error } = useSelector(
    (state: RootState) => state.todos,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const displayName = user?.name || "Guest";

  useEffect(() => {
    setTitle(`${displayName}'s ToDo-Listen`);
    dispatch(fetchToDoListsAsync());
    dispatch(fetchAllUserToDosAsync());
  }, [displayName, setTitle, dispatch]);

  const handleCreateList = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    try {
      await dispatch(createToDoListAsync({ title: newListTitle })).unwrap();
      setNewListTitle("");
    } catch (err) {
      console.error("List creation failed:", err);
    }
  };

  const handleDeleteList = async (id: number) => {
    try {
      await dispatch(deleteToDoListAsync(id)).unwrap();
    } catch (err) {
      console.error("Deletion failed:", err);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-10 bg-[rgba(15,23,52,0.6)] text-gray-100">
      {/* Creation Header Section */}
      <section className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-4 bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-2xl">
          <p className="text-sm font-semibold text-cyan-400 uppercase tracking-[3px] mb-4">
            Neue ToDo-Liste erstellen
          </p>
          <form
            onSubmit={handleCreateList}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Benenne deine Liste (z.B. Arbeit, Einkaufen...)"
                className="w-full bg-gray-900/50 border border-gray-600 p-3 pl-4 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none text-white placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              disabled={!newListTitle.trim()}
              className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 text-white font-bold px-8 py-3 rounded-xl transition-all cursor-pointer active:scale-95 shadow-lg shadow-cyan-900/20"
            >
              <span>Liste erstellen</span>
            </button>
          </form>
        </div>
      </section>

      {/* Grid Section */}
      <section className="max-w-7xl mx-auto">
        {loading && toDoListItems.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {toDoListItems.map((listItem) => {
              // Filter todos belonging to this specific list
              const listTodos = toDos.filter((t) => t.listId === listItem.id);

              // Count by priority
              const stats = {
                total: listTodos.length,
                totalCompleted: listTodos.filter((x) => x.completed).length,
                totalPending: listTodos.filter((t) => !t.completed).length,
                p1: listTodos.filter((t) => t.priority === 1).length,
                p2: listTodos.filter((t) => t.priority === 2).length,
                p3: listTodos.filter((t) => t.priority === 3).length,
                p4: listTodos.filter((t) => t.priority === 4).length,
                p5: listTodos.filter((t) => t.priority === 5).length,
              };

              return (
                <div
                  key={listItem.id}
                  className="transform transition-all duration-300 hover:-translate-y-2"
                >
                  <ToDoListItemComp
                    listItem={listItem}
                    handleDelete={handleDeleteList}
                    stats={stats}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && toDoListItems.length === 0 && (
          <div className="text-center p-20 bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-700">
            <p className="text-gray-500 text-lg">
              Noch keine Listen erstellt. Nutze das Formular oben, um deine
              erste ToDo-Liste zu erstellen!
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 text-sm">
            Error: {error}
          </div>
        )}
      </section>
    </div>
  );
};

export default ToDoLists;
