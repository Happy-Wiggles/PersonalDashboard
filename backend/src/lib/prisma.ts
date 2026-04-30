import { PrismaClient } from "@prisma/client";

console.log("Init Prisma client...");
const prisma = new PrismaClient();

export default prisma;
