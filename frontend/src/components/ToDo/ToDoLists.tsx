import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { apiClient } from "../../services/BackendApiService";
import type { ToDoListItem } from "../../types/ToDoListItem";
import ToDoListItemComp from "./ToDoListItemComp";

interface ToDoProps {
  setTitle: (title: string) => void;
}

const ToDoLists = ({ setTitle }: ToDoProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const displayName = user?.name || "Guest";

  const [lists, setLists] = useState<ToDoListItem[]>([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTitle(`${displayName}'s ToDo-Listen`);

    const fetchLists = async () => {
      try {
        const data = await apiClient.getToDoLists();
        setLists(data);
      } catch (error) {
        console.error("Fehler beim Laden der Listen:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLists();
  }, [displayName, setTitle]);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    try {
      const newList = await apiClient.createToDoList({ title: newListTitle });
      setLists((prev) => [...prev, newList]);
      setNewListTitle("");
    } catch (error) {
      alert("Liste konnte nicht erstellt werden.\nFehler: " + error);
    }
  };

  const handleDeleteList = async (id: number) => {
    try {
      await apiClient.deleteToDoList(id);
      setLists(lists.filter((list) => list.id != id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* New ToDoList Form */}
      <form
        onSubmit={handleCreateList}
        className="flex gap-2 bg-gray-800 p-4 rounded shadow"
      >
        <input
          type="text"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          placeholder="Name der neuen Liste..."
          className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded cursor-pointer transition-colors"
        >
          Erstellen
        </button>
      </form>

      {/* Show the lists */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="text-gray-400">Lade Listen...</p>
        ) : lists.length > 0 ? (
          lists.map((listItem) => (
            <ToDoListItemComp
              key={listItem.id}
              listItem={listItem}
              handleDelete={handleDeleteList}
            ></ToDoListItemComp>
          ))
        ) : (
          <p className="text-gray-400">
            Noch keine Listen vorhanden. Füge deine erste Liste hinzu!
          </p>
        )}
      </div>
    </div>
  );
};

export default ToDoLists;
