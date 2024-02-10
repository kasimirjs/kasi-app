import {BasicMessage} from "../Message";
import {CurRoute} from "../../router/Router";

export class RouteUpdatedMessage extends BasicMessage<RouteUpdatedMessage> {
    MsgName: string = "RouteUpdatedMessage";


    constructor(public route: CurRoute) {
        super();
    }
}
