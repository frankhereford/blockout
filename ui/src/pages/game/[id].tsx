import Link from 'next/link';
import { useEffect } from "react";

import { api } from "~/utils/api";

export default function Game() {

    return (
        <>
            <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#89e3fc] to-[#3a3e89]">
                this is to play a game
                <Link href="/game">
                    <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Go to Game
                    </button>
                </Link>
            </main>
        </>
    );
}