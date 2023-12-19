import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { GameProvider } from './contexts/GameProvider';

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <GameProvider>
        <Component {...pageProps} />
      </GameProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
