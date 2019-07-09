import { IfaceModel } from './iface.model';
import { SocketModel } from './socket.model';

export interface RespModel {
    type: string,
    interfaces?: IfaceModel[],
    sockets?: SocketModel[],
}
