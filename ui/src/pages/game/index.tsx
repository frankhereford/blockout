import { useEffect } from "react";
import { useRouter } from 'next/router';

import { api } from "~/utils/api";

export default function Home() {
    const router = useRouter();
    const createGame = api.game.create.useMutation({ });

    useEffect(() => {
        createGame.mutate({ height: 5, width: 5, depth: 5 })
        //createGame.mutate({  })
    }, []);

    useEffect(() => {
        //console.log("createGame.data: ", createGame.data);
        if (createGame.data?.id) {
            void router.push(`/game/${createGame.data.id}`);
        }
    }, [createGame.data]);

    return (
        <>
        </>
    );
}
