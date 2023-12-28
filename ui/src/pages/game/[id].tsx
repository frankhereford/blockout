import Link from "next/link";
import { useRouter } from "next/router";
import { Blockout } from "~/pages/components/Blockout";
import { Canvas } from "@react-three/fiber";
import { api } from "~/utils/api";

export default function Game() {
    const router = useRouter();
    const { id } = router.query;
    const getGame = api.game.get.useQuery(
        { id: id as string },
        { enabled: id !== undefined },
    );
    const getPile = api.pile.get.useQuery(
        { id: getGame.data?.pile?.id ?? "" },
        { enabled: getGame.data?.pile?.id !== undefined },
    );
    const addRandomCube = api.pile.addRandomCube.useMutation({});
    const addPiece = api.piece.create.useMutation({});

    const addRandomCubeToPile = () => {
        addRandomCube.mutate({ id: getPile.data?.id ?? "" });
    };

    const addRandomPieceToPile = () => {
        addPiece.mutate({ pile: getPile.data?.id ?? "" });
    };

    return (
        <>
            <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#89e3fc] to-[#3a3e89]">
                <div className="scene">
                    <Canvas shadows>
                        <Blockout id={id as string} />
                    </Canvas>
                    <div
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                        }}
                    >
                        <Link href="/game">
                            <button className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                                New Game
                            </button>
                        </Link>
                        <button
                            onClick={addRandomCubeToPile}
                            className="mt-4 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
                        >
                            Add Random Cube
                        </button>
                        <button
                            onClick={addRandomPieceToPile}
                            className="mt-4 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
                        >
                            Add Piece
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
