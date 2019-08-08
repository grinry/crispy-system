import { Server } from "socket.io";

export interface ChannelInterface {
  new (io: Server): ChannelInterface;
  registerHandlers(): void;
  onDisconnect(): Promise<void>;
}


