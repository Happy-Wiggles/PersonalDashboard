import { PrismaClient } from "@prisma/client";

console.log("Init Prisma Client...");
const prisma = new PrismaClient();

export default prisma;
