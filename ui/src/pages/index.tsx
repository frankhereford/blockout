import Head from "next/head";
import Link from "next/link";
import Login from "~/pages/components/Login";

//import { api } from "~/utils/api";


export default function Home() {
  // const hello = api.post.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Blockout</title>
        <meta name="description" content="Web Port of Blockout" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#89e3fc] to-[#3a3e89]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            {/* <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p> */}
            <Login />
          </div>
          <Link href="/game">
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                New Game
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
