import {router} from "./Router";


export const Route = {
    routesDefined: []

}


export function link() {
    console.log("link");
}

export function href(arg : any = null) {
    console.log("href");
    throw "undefined2zzz" + arg;
}


export function route(routeName: string, route : string) {
    return function (classOrDescriptor: any) : void {
        console.debug("registering route", classOrDescriptor, route);
        router.addRoute(routeName, route, classOrDescriptor);
        return classOrDescriptor;
    }
}
