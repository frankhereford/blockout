import Link from 'next/link';
import { useEffect} from "react";
import { useRouter } from 'next/router';

import { api } from "~/utils/api";

import { Blockout } from "~/pages/components/Blockout";

import { Canvas } from '@react-three/fiber'

export default function Game() {
    const router = useRouter();
    const { id } = router.query;
    // const getGame = api.game.get.useQuery({id: id as string});
    // const getPile = api.pile.get.useQuery({id: getGame.data?.pile?.id ?? ""}, {enabled: getGame.data?.pile?.id !== undefined});
    // const addRandomCube = api.pile.addRandomCube.useMutation({ 
    //     onSuccess: (data) => {
    //         console.log("Cube added: ", data);
    //     },
    // });

    // useEffect(() => {
    //     if (getGame.data) {
    //         setWidth(getGame.data.width);
    //         setHeight(getGame.data.height);
    //         setDepth(getGame.data.depth);
    //     }
    // }, [getGame.data]);

    const addRandomCubeToPile = () => {
        //addRandomCube.mutate({ id: getPile.data?.id ?? "" });
    }

    return (
        <>
            <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#89e3fc] to-[#3a3e89]">
                <div className="scene">
                    <Canvas shadows>
                        <Blockout id={id as string} />
                    </Canvas>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Link href="/game">
                            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                New Game
                            </button>
                        </Link>
                        <button onClick={addRandomCubeToPile} className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            Add Random Cube
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}