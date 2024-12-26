import type { Email } from "./Email";
import type { User } from "./User";

export type ServerToClientEvents = {};

export type ClientToServerEvents = {
  "Users:GetInfo": (payload: { email: Email }, callback: (user: User) => void) => void;
};

export type InterServerEvents = {};

export type SocketData = { email: string };
