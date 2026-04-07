import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function checkDatabase() {
  const db = await open({
    filename: "../database.db",
    driver: sqlite3.Database,
  });

  console.log("--- USER ÜBERSICHT ---");
  const users = await db.all("SELECT id, username, email, role FROM users");
  console.table(users);

  await db.close();
}

checkDatabase().catch(console.error);
