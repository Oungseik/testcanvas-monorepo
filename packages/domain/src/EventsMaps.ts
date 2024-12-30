import type { Android } from "./Android";
import type { Email } from "./Email";
import type { UserWithTimeStamps } from "./User";

const ERROR_CODES = ["BAD_REQUEST", "UNAUTHORIZED", "NOT_FOUND", "INTERNAL_SERVER_ERROR"] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];

export type ServerToClientEvents = {
  "Devices:AndroidConnected": (payload: Android) => void;
  "Devices:AndroidDisconnected": (payload: { udid: string }) => void;
};

type FailedData = { status: "fail"; error: ErrorCode };
type SucceedData<T> = { status: "success"; data: T };

export type ClientToServerEvents = {
  "Devices:GetDevices": (
    payload: {},
    callback: (data: SucceedData<Android[]> | FailedData) => void,
  ) => void;

  "Users:GetInfo": (
    payload: {},
    callback: (data: SucceedData<UserWithTimeStamps> | FailedData) => void,
  ) => void;
};

export type InterServerEvents = {};

export type SocketData = { email: Email };
