import React from "react";

function RoutesSidebar({ routes, handleClick }) {
    return (
        <div className="bg-white p-2 rounded shadow basis-1/4 sidebar">
            {routes.map((route, j) => (
                <div
                    className={`bg-white my-4 p-2 rounded flex flex-col text-center items-center cursor-pointer`}
                    key={j}
                    onClick={() => handleClick(route)}
                >
                    <div className="text-xl font-bold">
                        {route.route_short_name}
                    </div>
                    <div className="ps-2 text-sm text-gray-500">
                        {route.route_long_name}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RoutesSidebar;
