export interface ToDoListItem {
  id: number;
  title: string;
  userId: number;
}

export type CreateToDoListData = Omit<ToDoListItem, "id" | "userId">;
