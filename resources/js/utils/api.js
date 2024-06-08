export const getStopsByPrefix = async (search) => {
    const response = await fetch('/api/get-stops-by-prefix?prefix=' + search);
    const json = await response.json();
    return json;
}
