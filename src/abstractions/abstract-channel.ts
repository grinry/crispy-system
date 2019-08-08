import { Namespace, Server, Socket } from "socket.io";
import { ChannelInterface } from "~app/interfaces/channel.interface";

export abstract class AbstractChannel implements ChannelInterface {
  protected namespace: Namespace;
  protected socket: Socket;
  constructor(
    protected io: Server,
    protected channelName: string = '/',
    middleware?: (socket:Socket, fn: ( err?: any ) => void) => void
  ) {
    this.io = io;
    this.namespace = this.io.of(`${this.channelName}`);

    this.namespace.use(middleware ? middleware : () => {})
      .on('connection', (socket: Socket) => this.onConnect(socket));
  }
  protected async onConnect(socket: Socket): Promise<void> {

    console.log(`${socket.id} connected to ${this.channelName}`);
    this.namespace.clients((error, clients) => {
      console.log(`Clients online ${clients}`);
      if (error) {
        throw error;
      }
    });

    this.socket = socket;

    this.registerHandlers();
  }
  abstract registerHandlers(): void;
  abstract onDisconnect(): Promise<void>;

}
