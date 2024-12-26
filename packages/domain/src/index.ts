export type ServerToClientEvents = {};

export type ClientToServerEvents = {
  "Users:GetInfo": (
    payload: { email: string },
    callback: (user: { name: string; email: string }) => void,
  ) => void;
};

export type InterServerEvents = {};

export type SocketData = { email: string };
