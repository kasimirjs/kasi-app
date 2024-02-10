import {ka_router, router} from "./Router";



export function href(routeName : string, params: any = {}) : string {
   return ka_router().getHref(routeName, params);
}

export function goto(routeName : string, params : any = {}) : void {
    ka_router().goto(routeName, params);
}



/**
 *
 * @ClassDecorator
 * @param routeName     The name of the route (routes to same name will be handles SPA-mode by sending RouteChangeEvent)
 * @param route
 */
export function KaRoute(routeName: string, route : string) {
    return function (classOrDescriptor: any) : void {
        //console.debug("registering route", classOrDescriptor, route);
        ka_router().addRoute(routeName, route, classOrDescriptor);
        return classOrDescriptor;
    }
}

