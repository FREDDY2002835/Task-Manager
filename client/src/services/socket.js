import { io } from "socket.io-client";
import { SERVER_ORIGIN } from "./api";

// Opens a live connection to the server, authenticated with the same
// login token the REST API uses. Each chat screen opens its own
// connection and closes it when the user leaves.
export function createChatSocket() {
  return io(SERVER_ORIGIN, {
    auth: { token: localStorage.getItem("token") },
  });
}
