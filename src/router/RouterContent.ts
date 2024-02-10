import {customElement, ka_create_element, ka_dom_ready} from "@kasimirjs/embed";
import {CurRoute, ka_router, router} from "./Router";

@customElement("ka-router-content")
class RouterContent extends HTMLElement {


    async connectedCallback() {
        await ka_dom_ready();
        let route = ka_router().update()
        currentRoute = route;
        console.log("currentRoute", ka_router().currentRoute);

        let element = ka_create_element("div", {});
        element.innerText = "BraceRoute: route is not defined: '" + router.currentRoute + "'"
        if (route !== null) {
            element = new (route.element)(route.route_params);
        }
        this.appendChild(element);
    }
}

export var currentRoute : CurRoute | null;
