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
                    </div>
                </div>
            </main>
        </>
    );
}
