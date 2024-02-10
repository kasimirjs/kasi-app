
import {RouteUpdatedMessage} from "../message/type/RouteUpdatedMessage";
import {ka_messageBus} from "../message/MessageBus";




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
     * Return the Link to the route
     *
     * @param routeName
     * @param params
     */
    public getHref(routeName : string, params: any = {}) : string {
        let routeDef = this.routes.find((route) => route.name === routeName);
        let paramsTotal = {...this.currentRoute.route_params, ...params};

        let route = routeDef.route.replace(/\{([a-z0-9_]+)}/gi, (p1, p2) => paramsTotal[p2]);
        return route;
    }

    /**
     * Navigate to a route
     *
     * @param routeName
     * @param params
     * @deprecated use navigate instead
     */
    public goto(routeName : string, params : any = {}) {
        this.navigate(routeName, params)
    }

    /**
     * Switch the route. If the route name is the same as the current route, the RouteUpdatedMessage will be triggered
     *
     * @param routeName
     * @param params
     */
    public navigate(routeName : string, params : any = {}) {
        console.log("navigate", routeName, params);
        if (this.currentRoute.name === routeName) {
            // SPO Mode. Modify the URL but do not reload the page
            window.history.pushState({}, "", this.getHref(routeName, params));


            let routeUpdatedMessage = new RouteUpdatedMessage(this.update());
            ka_messageBus().trigger(routeUpdatedMessage);
            return;
        }
        window.location.pathname = this.getHref(routeName, params);
    }

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


/**
 * @deprecated use ka_router() instead
 */
export const router = new Router();

export function ka_router() : Router {
    return router
}


