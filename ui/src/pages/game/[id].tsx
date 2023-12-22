import Link from 'next/link';
import { useEffect } from "react";

import { api } from "~/utils/api";

import { Blockout } from "~/pages/components/Blockout";

import { Canvas } from '@react-three/fiber'

export default function Game() {

    return (
        <>
            <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#89e3fc] to-[#3a3e89]">
                <Canvas shadows>
                    <Blockout width={7} height={10} depth={5} />
                </Canvas>
                <Link href="/game">
                    <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        New Game
                    </button>
                </Link>
            </main>
        </>
    );
}
