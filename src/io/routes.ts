import { Server } from "socket.io";
import { MovementChannel } from "~app/io/movement.channel";

export default (io: Server) => {
  new MovementChannel(io, '/');
};
