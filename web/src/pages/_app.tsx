import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { PieceProvider } from './contexts/PieceProvider';

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <PieceProvider>
        <Component {...pageProps} />
      </PieceProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
