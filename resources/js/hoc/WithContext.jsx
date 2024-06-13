import React, { useContext } from "react";
import { AppContext } from "../context/AppContextProvider";


function WithContext(Component) {
  return function ContextRenderer(props) {
    const { state, dispatch } = useContext(AppContext);

    return <Component state={state} dispatch={dispatch} {...props} />;
  };
}

export default WithContext;
