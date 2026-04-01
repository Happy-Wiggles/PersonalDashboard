export interface ToDoItem {
  id: number;
  task: string;
  priority: number;
  completed: boolean;
  listId: number;
}

export type CreateToDoItemData = Omit<ToDoItem, "id" | "completed" | "listId">;
