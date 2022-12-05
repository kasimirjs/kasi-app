import {router} from "./Router";


export const Route = {
    routesDefined: []

}


export function href(routeName : string, params: any = {}) {
    let routeDef = router.routes.find((route) => route.name === routeName);
    let paramsTotal = {...router.currentRoute.route_params, ...params};

    let route = routeDef.route.replace(/\{([a-z0-9_]+)\}/gi, (p1, p2) => paramsTotal[p2]);
    return route;
}

export function link(routeName : string, params : any = {}) {
    window.location.pathname = href(routeName, params);
}


export function route(routeName: string, route : string) {
    return function (classOrDescriptor: any) : void {
        console.debug("registering route", classOrDescriptor, route);
        router.addRoute(routeName, route, classOrDescriptor);
        return classOrDescriptor;
    }
}
