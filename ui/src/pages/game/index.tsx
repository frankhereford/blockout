import Head from "next/head";
import { useEffect } from "react";
// import Link from "next/link";

import { api } from "~/utils/api";


export default function Home() {

    const createGame = api.game.create.useMutation({ });

    useEffect(() => {
        const response = createGame.mutate({ })
        console.log(response)
    }, []);

    return (
        <>
            <Head>
                <title>Blockout</title>
                <meta name="description" content="Web Port of Blockout" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#89e3fc] to-[#3a3e89]">
                this is to create a game
            </main>
        </>
    );
}
