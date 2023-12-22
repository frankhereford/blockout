import Link from 'next/link';
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

import { api } from "~/utils/api";

import { Blockout } from "~/pages/components/Blockout";

import { Canvas } from '@react-three/fiber'

export default function Game() {
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);
    const [depth, setDepth] = useState(1);

    const router = useRouter();
    const { id } = router.query;
    console.log("id: ", id)
    const getGame = api.game.get.useQuery({id: id as string});
    const getPile = api.pile.get.useQuery({id: id as string});

    useEffect(() => {
        if (getGame.data) {
            setWidth(getGame.data.width);
            setHeight(getGame.data.height);
            setDepth(getGame.data.depth);
            console.log("getGame.data: ", getGame.data);
        }
    }, [getGame.data]);

    useEffect(() => {
    console.log("getGame.data: ", getGame.data);
    }, [getGame.data]);
    

    return (
        <>
            <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#89e3fc] to-[#3a3e89]">
                <div className="scene">
                    <Canvas shadows>
                        <Blockout width={width} height={height} depth={depth} />
                    </Canvas>
                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                        <Link href="/game">
                            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                New Game
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}