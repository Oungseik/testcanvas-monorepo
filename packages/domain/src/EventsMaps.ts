import type { User } from "./User";

export type ServerToClientEvents = {};

export type ClientToServerEvents = {
  "Users:GetInfo": (payload: {}, callback: (user: User) => void) => void;
};

export type InterServerEvents = {};

export type SocketData = { email: string };
