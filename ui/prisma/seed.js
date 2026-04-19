import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const pieces = [
    {
        name: "solo",
        origin: { x: 0, y: 0, z: 0 },
        shape: [{ x: 0, y: 0, z: 0 }],
        color: "red",
    },
    {
        name: "stick",
        origin: { x: 1, y: 0, z: 0 },
        shape: [
            { x: 0, y: 0, z: 0 },
            { x: 1, y: 0, z: 0 },
            { x: 2, y: 0, z: 0 },
        ],
        color: "green",
    },
    {
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
    {
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
    {
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
    {
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
    {
        name: "angle",
        origin: { x: 1, y: 0, z: 0 },
        shape: [
            { x: 0, y: 0, z: 0 },
            { x: 1, y: 0, z: 0 },
            { x: 1, y: 0, z: 1 },
        ],
        color: "orange",
    },
];

async function main() {
    for (const piece of pieces) {
        await prisma.library.upsert({
            where: { name: piece.name },
            update: {},
            create: piece,
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        void prisma.$disconnect();
    });
