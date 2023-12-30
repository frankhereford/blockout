import { type NextApiRequest, type NextApiResponse } from "next";
import { appRouter } from "../../../server/api/root";
import { createTRPCContext } from "../../../server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";

const gameByIdHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    // Create context and caller
    const ctx = await createTRPCContext({ req, res });
    const caller = appRouter.createCaller(ctx);
    try {
        const { id } = req.query;
        const game = await caller.piece.get({ id: id as string });
        res.status(200).json(game);
    } catch (cause) {
        if (cause instanceof TRPCError) {
            // An error from tRPC occurred
            const httpCode = getHTTPStatusCodeFromError(cause);
            return res.status(httpCode).json(cause);
        }
        // Another error occurred
        console.error(cause);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default gameByIdHandler;