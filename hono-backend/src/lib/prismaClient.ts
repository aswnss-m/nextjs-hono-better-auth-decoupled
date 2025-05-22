import { PrismaClient } from "../generated/prisma";

declare global {
	var prisma: PrismaClient;
}

// biome-ignore lint/suspicious/noRedeclare: This is needed here
const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalThis.prisma = prisma;
}

export default prisma;
