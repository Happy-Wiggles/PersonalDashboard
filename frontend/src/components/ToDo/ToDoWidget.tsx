import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchToDoListsAsync,
  fetchAllUserToDosAsync,
} from "../../features/todos/ToDosSlice";
import type { AppDispatch, RootState } from "../../store/store";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const ToDoWidget = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { toDoListItems, toDos, loading } = useSelector(
    (state: RootState) => state.todos,
  );

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        dispatch(fetchToDoListsAsync()),
        dispatch(fetchAllUserToDosAsync()),
      ]);
    };

    loadData();
  }, [dispatch]);

  const topTodos = [...toDos]
    .filter((t) => !t.completed)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5);

  const getListName = (listId: number) => {
    if (!toDoListItems || toDoListItems.length === 0) {
      return "Lade...";
    }

    const list = toDoListItems.find((l) => Number(l.id) === listId);
    return list ? list.title : "Unbekannte Liste";
  };

  const getPriorityColor = (
    priority: number,
    isShadow: boolean = false,
  ): string => {
    const colors: Record<number, string> = {
      1: isShadow
        ? "shadow-[0px_0px_10px_rgba(150,150,150,0.9)]"
        : "bg-[rgba(150,150,150,0.9)]",
      2: isShadow
        ? "shadow-[0px_0px_10px_rgba(2,150,2,0.9)]"
        : "bg-[rgba(2,150,2,0.6)]",
      3: isShadow
        ? "shadow-[0px_0px_10px_rgba(0,50,160,0.9)]"
        : "bg-[rgba(0,50,160,0.6)]",
      4: isShadow
        ? "shadow-[0px_0px_10px_rgba(255,125,15,0.9)]"
        : "bg-[rgba(255,125,15,0.6)]",
      5: isShadow
        ? "shadow-[0px_0px_10px_rgba(215,25,15,0.9)]"
        : "bg-[rgba(215,25,15,0.6)]",
    };
    return colors[priority] || colors[1];
  };

  return (
    <div>
      <div className="bg-gray-800/60 p-5 rounded-xl border border-gray-600/70 shadow-[0px_0px_18px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-100 text-[18px] uppercase tracking-widest flex items-center gap-2 titles-pulse">
            {topTodos.length === 0 ? null : (
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
            )}
            Wichtigste Aufgaben
          </h3>
          <button
            onClick={() => navigate("/todolists")}
            className="text-[12px] text-cyan-400 hover:text-cyan-200 transition-colors uppercase font-bold cursor-pointer"
          >
            Alle anzeigen
          </button>
        </div>

        <div className="space-y-3">
          {loading && toDos.length === 0 ? (
            <div className="flex justify-center py-8">
              <ArrowPathIcon className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
          ) : topTodos.length > 0 ? (
            topTodos.map((todo) => {
              const listName = getListName(todo.listId);
              return (
                <div
                  key={todo.id}
                  className={`flex items-center justify-between p-3 bg-gray-950/30 rounded-lg border border-gray-700/50 group hover:border-gray-500 transition-all text-left cursor-pointer ${getPriorityColor(todo.priority, true)}`}
                  onClick={() => navigate(`/todos/${todo.listId}/${listName}`)}
                >
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm text-gray-200 truncate group-hover:text-white transition-colors">
                      {todo.task}
                    </span>
                    <span className="text-[12px] text-gray-500 font-bold uppercase tracking-wider">
                      Liste: {listName}
                    </span>
                  </div>
                  <div
                    className={`ml-2 px-2 py-1 rounded text-[10px] font-black text-white ${getPriorityColor(todo.priority)}`}
                  >
                    P{todo.priority}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-[18px] italic text-center py-4">
              Keine offenen Aufgaben gefunden. Gut gemacht! 🎉
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToDoWidget;
