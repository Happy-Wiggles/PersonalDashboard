interface User {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: string;
}

export type { User };
