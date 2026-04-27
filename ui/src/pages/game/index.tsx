import { useEffect } from "react";
import { useRouter } from "next/router";

import { api } from "~/utils/api";

export default function Home() {
    const router = useRouter();
    const createGame = api.game.create.useMutation({});

    useEffect(() => {
        const height = 7; // Math.floor(Math.random() * 5) + 4; // Random integer between 4 and 8
        const width = 5; // Math.floor(Math.random() * 3) * 2 + 3; // Random odd integer between 3 and 7
        const depth = 5; // Math.floor(Math.random() * 3) * 2 + 3; // Random odd integer between 3 and 7

        createGame.mutate({ height, width, depth });
    }, []);

    useEffect(() => {
        if (createGame.data?.id) {
            void router.push(`/game/${createGame.data.id}`);
        }
    }, [createGame.data]);

    return <></>;
}
