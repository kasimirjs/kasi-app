import {router} from "../router/Router";



export function api_url(path : string, params : any= {}) : {url: string, method: string} {
    let url = `${path}`;
    let method = "GET";
    [method, url] = url.split("@");
    url = url.replace(/{([a-zA-Z0-9_\-]+)}/g, (match, p1) => {
        let val = null;
        if (typeof params[p1] !== "undefined")
            val = params[p1];
        else if (typeof router.currentRoute.route_params[p1] !== "undefined")
            val = router.currentRoute.route_params[p1]
        else
            throw "Route param: " + p1 + " not resolvable"
        delete params[p1];
        // Allow Array paths
        if (Array.isArray(val)) {
            return val.map(i => encodeURIComponent(i)).join("/");
        }
        return encodeURIComponent(val);
    })
    if (params !== null) {
        url += "?" + (new URLSearchParams(params));
    }
    return {url, method};
}


/**
 * Query the api
 *
 * <example>
 *     let result = await api_call("GET@/v1/api/{subscription_id}/{scope_id}/index.json", {subscription_id: 1, scope_id: 2})
 * </example>
 *
 * @param path
 * @param params
 * @param body
 */
export async function api_call(path : string, params : any= {}, body : any =null) {

    let ret =  api_url(path, params);
    let url = ret.url;
    let method = ret.method;

    if (params !== null) {
        url += "?" + (new URLSearchParams(params));
    }
    let response = await fetch(url, {
        method: method,
        body: body !== null ? JSON.stringify(body) : null,
        headers: {
            "Content-Type": "application/json"
        }
    });
    if ( ! response.ok) {

        let text = await response.text();
        try {
            let json = JSON.parse(text);
            alert ("Request failed: " + response.statusText + "\n\n" + json.error.message);

        } catch (e) {
            alert("Request failed: " + response.statusText + ":\n\n " + text);
            throw e;
        }
        throw text;
    }

    return await response.json();
}
