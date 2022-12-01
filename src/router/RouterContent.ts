import {customElement, ka_create_element, ka_dom_ready} from "@kasimirjs/embed";
import {router} from "./Router";

@customElement("ka-router-content")
class RouterContent extends HTMLElement {


    async connectedCallback() {
        console.log("ka-router-content");
        await ka_dom_ready();
        let route = router.update()
        currentRoute = route;
        console.log("currentRoute", router.currentRoute);

        let element = ka_create_element("div", {});
        element.innerText = "BraceRoute undefined: "
        if (route !== null) {
            element = new (route.element)(route.route_params);
        }
        this.appendChild(element);
    }
}

export var currentRoute;
