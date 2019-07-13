import { IfaceModel } from './iface.model';
import { SocketModel } from './socket.model';

export interface RespModel {
    type: string,
    version: string,
    listenAddress: string,
    dstAddress?: string,
    interfaces?: IfaceModel[],
    sockets?: SocketModel[],
    description?: string
}
