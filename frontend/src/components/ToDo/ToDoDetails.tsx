import { useParams } from "react-router";
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
  }, [setTitle, listId]);

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

  const getPriorityColor = (
    priority: number,
    isShadow: boolean = false,
  ): string => {
    let color: string = "";

    if (isShadow) {
      switch (priority) {
        case 1:
          color = "shadow-gray-400";
          break;
        case 2:
          color = "shadow-[0px_0px_10rgba(2,150,2,0.8)]";
          break;
        case 3:
          color = "shadow-[0px_0px_10rgba(0,50,160,0.8)]";
          break;
        case 4:
          color = "shadow-[0px_0px_10rgba(255,125,15,0.8)]";
          break;
        case 5:
          color = "shadow-[0px_0px_10rgba(215,25,15,0.8)]";
          break;
        default:
          color = "shadow-gray-400";
          break;
      }
    } else {
      switch (priority) {
        case 1:
          color = "bg-gray-400";
          break;
        case 2:
          color = "bg-[rgba(2,150,2,0.8)]";
          break;
        case 3:
          color = "bg-[rgba(0,50,160,0.8)]";
          break;
        case 4:
          color = "bg-[rgba(255,125,15,0.8)]";
          break;
        case 5:
          color = "bg-[rgba(215,25,15,0.8)]";
          break;
        default:
          color = "bg-gray-400";
          break;
      }
    }

    return color;
  };

  const toggleComplete = async (todo: ToDoItem) => {
    try {
      await apiClient.updateToDo(todo.id, { completed: !todo.completed });

      const newToDoList = toDos.map((toDoItem) =>
        toDoItem.id === todo.id
          ? { ...toDoItem, completed: !toDoItem.completed }
          : toDoItem,
      );

      setToDos(newToDoList);
    } catch (error) {
      console.error("Konnte Status nicht ändern", error);
    }
  };

  const getButtonCompletedStyle = (completed: boolean): string => {
    if (completed) {
      return "bg-[rgba(100,123,150,0.6)] hover:bg-[rgba(100,123,150,0.8)]";
    } else {
      return "bg-[rgba(6,182,212,0.6)] hover:bg-[rgba(6,182,212,0.8)]";
    }
  };

  const getToDoDivCompletedStyle = (
    completed: boolean,
    priority: number,
  ): string => {
    if (completed) {
      return "bg-[rgba(54,51,51,0.2)] p-4 shadow flex flex-col gap-1 w-70 h-40 rounded-lg border-gray-600 justify-around items-center truncate text-gray-500";
    } else {
      return `bg-gray-800 p-4 shadow flex flex-col gap-1 w-70 h-40 rounded-lg ${getPriorityColor(priority ? priority : 3, true)} justify-around items-center truncate text-gray-100`;
    }
  };

  return (
    <div>
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
            <option
              className={`${getPriorityColor(1)} cursor-pointer`}
              value={1}
            >
              Prio 1 (Niedrig)
            </option>
            <option
              className={`${getPriorityColor(2)} cursor-pointer`}
              value={2}
            >
              Prio 2
            </option>
            <option
              className={`${getPriorityColor(3)} cursor-pointer`}
              value={3}
            >
              Prio 3 (Mittel)
            </option>
            <option
              className={`${getPriorityColor(4)} cursor-pointer`}
              value={4}
            >
              Prio 4
            </option>
            <option
              className={`${getPriorityColor(5)} cursor-pointer`}
              value={5}
            >
              Prio 5 (Hoch!)
            </option>
          </select>

          <button
            type="submit"
            className="bg-[rgba(6,182,212,0.7)] hover:bg-[rgba(6,182,212,1)] px-4 py-2 rounded text-white transition cursor-pointer"
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
              <div
                key={todo.id}
                className={`${getToDoDivCompletedStyle(todo.completed, todo.priority)}`}
              >
                <p className="font-bold text-[20px] w-60 truncate">
                  {todo.task}
                </p>
                <div
                  className={`${getPriorityColor(todo.priority)} text-[17px] font-semibold text-gray-200 rounded-2xl w-25 px-2 py-1`}
                >
                  <p>Priorität: {todo.priority}</p>
                </div>
                <div className="flex flex-row justify-around">
                  <button
                    className={`${getButtonCompletedStyle(todo.completed)} text-gray-100 w-full rounded-lg p-2 cursor-pointer mr-4`}
                    onClick={() => toggleComplete(todo)}
                  >
                    {todo.completed ? "Nicht Erledigt" : "Erledigt"}
                  </button>
                  <button
                    className="bg-[rgba(150,20,2,0.7)] hover:bg-[rgba(200,2,2,0.9)] w-25 text-gray-100 rounded-lg p-2 cursor-pointer"
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
