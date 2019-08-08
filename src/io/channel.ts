import { Namespace, Server, Socket } from "socket.io";

interface ConnectionInterface {
  id: string;
  io: Server;
  namespace: Namespace;
  socket: Socket;
  onConnect(): Promise<void>;
  onDisconnect();
  registerHandlers(): Promise<void>;
}

type ChannelMiddleware = (socket:Socket, fn: ( err?: any ) => void) => void;
type Channel = any/*typeof ConnectionInterface*/;

const connections: ConnectionInterface[] = [];

export function createChannel(
  io: Server,
  name: string,
  Class: Channel,
  middleware?: ChannelMiddleware
) {

  let namespace = io.of(`${name}`);
  if (middleware) {
    namespace = namespace.use(middleware);
  }

  namespace.on('connection', (socket: Socket) => connect(socket));

  const connect = async (socket: Socket) => {
    // @ts-ignore
    const connection = new Class();
    connection.id = socket.id;
    connection.io = io;
    connection.namespace = namespace;
    connection.socket = socket;
    await connection.onConnect();
    await connection.registerHandlers();
    connection.socket.on('disconnect', async () => {
      await connection.onDisconnect();
      disconnect(connection);
    });
    connections.push(connection);

    console.log('connections ', connections.length);
  };

  const disconnect = (connection: ConnectionInterface) => {
    console.log('Disconnecting things: ', connections.length);
    const index = connections.indexOf(connection);
    if (index != -1) {
      connections.splice(index, 1);
    }
  };
}

export class MovementConnection implements ConnectionInterface {
  id: string;
  io: Server;
  namespace: Namespace;
  socket: Socket;
  async onConnect() {
    console.log('movement connected', this.id);
  }

  async onDisconnect() {

    console.log('movement disconnected', this.id);
  }

  async registerHandlers() {
    console.log('movement connected', this.id);
  }

}

createChannel(null, 'hey', MovementConnection);
