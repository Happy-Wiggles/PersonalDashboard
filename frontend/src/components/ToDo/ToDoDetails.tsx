import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { apiClient } from "../../services/BackendApiService";
import type { ToDoItem } from "../../types/ToDoItem";

interface ToDoDetailsProps {
  setTitle: (title: string) => void;
}

const ToDoDetails = ({ setTitle }: ToDoDetailsProps) => {
  const { listId } = useParams<{ listId: string }>();
  const [toDos, setToDos] = useState<ToDoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newTaskName, setNewTaskName] = useState("");
  const [priority, setPriority] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const loadToDos = async () => {
      if (!listId) return;
      try {
        const data = await apiClient.getToDoByListId(Number(listId));
        setToDos(data);

        const todoList = (await apiClient.getToDoLists()).find(
          (list) => list.id == Number(listId),
        );

        setTitle(`ToDos der "${todoList?.title}" Liste`);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadToDos();
  }, [listId]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim() || !listId) return;

    try {
      const newTask = await apiClient.addToDoToList(Number(listId), {
        task: newTaskName,
        priority: priority,
      });

      setToDos((prev) => [...prev, newTask]);

      setNewTaskName("");
    } catch (error) {
      console.error("Fehler beim Erstellen des ToDos:", error);
      alert("Konnte das ToDo nicht speichern.");
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await apiClient.deleteToDo(id);
      setToDos(toDos.filter((todo) => todo.id != id));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleComplete = async (todo: ToDoItem) => {
    try {
      await apiClient.updateToDo(todo.id, { completed: !todo.completed });

      setToDos((prev) =>
        prev.map((t) =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t,
        ),
      );
    } catch (error) {
      console.error("Konnte Status nicht ändern", error);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate("/todolists")}
        className="mb-4 ml-2 bg-gray-500 text-gray-200 rounded-lg p-3 flex items-center gap-2 cursor-pointer"
      >
        Zurück zur Übersicht
      </button>
      <form
        onSubmit={handleAddTask}
        className="mb-6 m-2 flex flex-col gap-2 bg-gray-800 p-4 rounded-lg"
      >
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Was gibt es zu tun?"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="p-2 rounded bg-gray-700 text-white border border-gray-600 cursor-pointer"
          >
            <option className="bg-gray-400 cursor-pointer" value={1}>
              Prio 1 (Niedrig)
            </option>
            <option className="bg-green-600 cursor-pointer" value={2}>
              Prio 2
            </option>
            <option className="bg-blue-400 cursor-pointer" value={3}>
              Prio 3 (Mittel)
            </option>
            <option className="bg-orange-400 cursor-pointer" value={4}>
              Prio 4
            </option>
            <option className="bg-red-400 cursor-pointer" value={5}>
              Prio 5 (Hoch!)
            </option>
          </select>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white transition cursor-pointer"
          >
            Hinzufügen
          </button>
        </div>
      </form>
      {isLoading ? (
        <p>Aufgaben werden noch geladen...</p>
      ) : toDos.length === 0 ? (
        <p>Noch keine ToDos erstellt! Fang doch gleich an!</p>
      ) : (
        <div className="space-y-2 gap-2 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {toDos
            .sort((a, b) => b.priority - a.priority)
            .map((todo) => (
              // TODO: use toDo.completed to change <div> appearance and use "Erledigt" button to toggle "toggleComplete"
              <div
                key={todo.id}
                className="bg-gray-800 p-4 shadow flex flex-col gap-1 w-70 h-40 rounded-lg border border-cyan-500 justify-around"
              >
                <p className="font-semibold text-white truncate">{todo.task}</p>
                <p className="text-gray-300">Priorität: {todo.priority}</p>
                <div className="flex flex-row justify-around">
                  <button className="bg-green-600 hover:bg-green-500 w-25 text-gray-100 rounded-lg p-2 cursor-pointer">
                    Erledigt
                  </button>
                  <button
                    className="bg-red-700 hover:bg-red-500 w-25 text-gray-100 rounded-lg p-2 cursor-pointer"
                    onClick={() => handleDeleteTask(todo.id)}
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ToDoDetails;
