import type { Email } from "./Email";
import type { UserWithTimeStamps } from "./User";

const ERROR_CODES = ["NOT_FOUND", "INTERNAL_SERVER_ERROR"] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];

export type ServerToClientEvents = {};

export type ClientToServerEvents = {
  "Users:GetInfo": (
    payload: {},
    callback: (
      data: { status: "success"; data: UserWithTimeStamps } | { status: "fail"; error: ErrorCode },
    ) => void,
  ) => void;
};

export type InterServerEvents = {};

export type SocketData = { email: Email };
