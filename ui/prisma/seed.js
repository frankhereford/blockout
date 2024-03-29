/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.library.create({
        data: {
            name: "solo",
            origin: { x: 0, y: 0, z: 0 },
            shape: [{ x: 0, y: 0, z: 0 }],
            color: "red",
        },
    });
    await prisma.library.create({
        data: {
            name: "stick",
            origin: { x: 1, y: 0, z: 0 },
            shape: [
                { x: 0, y: 0, z: 0 },
                { x: 1, y: 0, z: 0 },
                { x: 2, y: 0, z: 0 },
            ],
            color: "green",
        },
    });
    await prisma.library.create({
        data: {
            name: "zig",
            origin: { x: 1, y: 0, z: 0 },
            shape: [
                { x: 0, y: 0, z: 0 },
                { x: 1, y: 0, z: 0 },
                { x: 1, y: 1, z: 0 },
                { x: 2, y: 1, z: 0 },
            ],
            color: "blue",
        },
    });
    await prisma.library.create({
        data: {
            name: "el",
            origin: { x: 1, y: 0, z: 0 },
            shape: [
                { x: 0, y: 0, z: 0 },
                { x: 1, y: 0, z: 0 },
                { x: 2, y: 0, z: 0 },
                { x: 2, y: 1, z: 0 },
            ],
            color: "yellow",
        },
    });
    await prisma.library.create({
        data: {
            name: "tee",
            origin: { x: 1, y: 0, z: 0 },
            shape: [
                { x: 0, y: 0, z: 0 },
                { x: 1, y: 0, z: 0 },
                { x: 1, y: 1, z: 0 },
                { x: 2, y: 0, z: 0 },
            ],
            color: "brown",
        },
    });
    await prisma.library.create({
        data: {
            name: "square",
            origin: { x: 1, y: 0, z: 0 },
            shape: [
                { x: 0, y: 0, z: 0 },
                { x: 1, y: 0, z: 0 },
                { x: 0, y: 1, z: 0 },
                { x: 1, y: 1, z: 0 },
            ],
            color: "teal",
        },
    });
    await prisma.library.create({
        data: {
            name: "angle",
            origin: { x: 1, y: 0, z: 0 },
            shape: [
                { x: 0, y: 0, z: 0 },
                { x: 1, y: 0, z: 0 },
                { x: 1, y: 0, z: 1 },
            ],
            color: "orange",
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        void prisma.$disconnect();
    });
