import type { AppServer, AppSocket } from "@/types";

export function usersHandler(io: AppServer, socket: AppSocket) {
  socket.on("Users:GetInfo", async (data, callback) => {});
}
