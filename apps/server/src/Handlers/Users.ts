import type { AppServer, AppSocket } from "@/types";
import type { Role } from "@repo/domain";

export function registerUsersHandler(_io: AppServer, socket: AppSocket) {
  socket.on("Users:GetInfo", async (data, callback) => {
    callback({ email: data.email, name: "john doe", role: "ADMIN" as Role });
  });
}
