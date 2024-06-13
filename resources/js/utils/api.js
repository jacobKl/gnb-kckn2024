const getNumericalRouteName = (route) => {
    return parseInt(route.route_short_name.slice(1))
}

export const getStopsByPrefix = async (search) => {
    const response = await fetch('/api/get-stops-by-prefix?prefix=' + search);
    const json = await response.json();
    return json;
}

export const posessRoutesData = async () => {
    const result = await fetch("/api/get-described-routes");
    const json = await result.json();

    return json.sort((a,b) => getNumericalRouteName(a) - getNumericalRouteName(b));
}
