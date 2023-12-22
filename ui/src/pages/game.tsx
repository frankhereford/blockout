import Head from "next/head";
// import Link from "next/link";

import { api } from "~/utils/api";


export default function Home() {

    const game = api.game.create.useMutation({ });

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
