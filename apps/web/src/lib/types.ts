import type { ClientToServerEvents, ServerToClientEvents } from "@repo/domain";
import type { Socket } from "socket.io-client";

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
