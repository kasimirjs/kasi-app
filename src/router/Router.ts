import * as path from "path";
import {route} from "./fuctions";




export type RouteDefinition = {
    name: string;
    route: string;
    regex: string;
    element: any
}

export type CurRoute = {
    name: string
    route: string
    regex: string;
    element: any
    route_params: { [key:string]: string }
    query_params:  { [key:string]: string }
    pathname: string
}

class Router {
    public routes : RouteDefinition[] = [];

    public currentRoute : CurRoute | null = null;


    /**
     * Transform a route definition to regular expression
     *
     * @param route
     */
    protected routeDef2RegEx(route : string) : string {
        // console.log(route);
        let regex = new RegExp(/{(?<param>[a-zA-Z0-9_]+)}/g)
        let r = route.replace(regex, (matches, param) => {
            return `(?<${param}>[^/]+)`
        });
        return `^${r}$`;
    }

    public addRoute(name: string, route : string, element : HTMLElement) : void {
        this.routes.push({name, route: route, regex: this.routeDef2RegEx(route), element: element});
    }

    /**
     * Parse
     */
    public update(pathname : string = null) : CurRoute {
        if (pathname === null)
            pathname = location.pathname

        // Ignore trailing slash
        if (pathname.endsWith("/"))
            pathname = pathname.slice(0, -1);


        for(let route of this.routes) {
            let regex = new RegExp(route.regex);
            let matches = regex.exec(pathname);
            if (matches === null)
                continue;

            let routeRet = {...route} as CurRoute;
            routeRet.route_params = matches.groups
            routeRet.pathname = pathname
            this.currentRoute = routeRet;
            return routeRet
        }
        return null;
    }

}


export const router = new Router();

