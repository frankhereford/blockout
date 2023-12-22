import { useEffect } from "react";
import { useRouter } from 'next/router';

import { api } from "~/utils/api";

export default function Home() {
    const router = useRouter();
    const createGame = api.game.create.useMutation({ });

    useEffect(() => {
        createGame.mutate({ })
    }, []);

    useEffect(() => {
        console.log("createGame.data: ", createGame.data);
        if (createGame.data?.id) {
            void router.push(`/game/${createGame.data.id}`);
        }
    }, [createGame.data]);

    return (
        <>
            <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#89e3fc] to-[#3a3e89]">
                this is to create a game
            </main>
        </>
    );
}
