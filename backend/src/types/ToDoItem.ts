interface ToDoItem {
  id: number;
  task: string;
  priority: number;
  completed: boolean;
  listId: number;
}

export type { ToDoItem };
