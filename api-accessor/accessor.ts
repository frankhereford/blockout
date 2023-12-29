//import fetch from 'node-fetch';
// Use dynamic import for ES Modules
let fetch;
(async () => {
    fetch = (await import('node-fetch')).default;
    if (!globalThis.fetch) {
        globalThis.fetch = fetch as unknown as typeof globalThis.fetch;
    }
})();

if (!globalThis.fetch) {
    globalThis.fetch = fetch as unknown as typeof globalThis.fetch;
}

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '../ui/src/server/api/root'; // removed .ts extension


const client = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:3000/api/trpc',

            // You can pass any HTTP headers you wish here
            async headers() {
                return {
                    //authorization: getAuthCookie(),
                };
            },
        }),
    ],
});

async function main() {
    const gameId = process.argv[2];
    if (!gameId) {
        console.error('Please provide a game ID as a command-line argument.');
        process.exit(1);
    }

    try {
        const game = await client.query('game.get', { id: gameId });
        console.log(game);
    } catch (err) {
        console.error(err);
    }
}

main();