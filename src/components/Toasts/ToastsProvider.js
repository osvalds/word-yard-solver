import React, {useContext, useReducer} from "react";
import {uuidv4} from "../../Util";

const ToastsContext = React.createContext();

export function useToasts() {
    const context = useContext(ToastsContext);

    if (!context) {
        throw new Error(`ToastsContext must be used within a UserProvider`)
    }

    return context
}

function toastsReducer(state, action) {
    switch (action.action) {
        case "add":
            action.data.id = uuidv4();
            return [...state, action.data]
        case "remove":
            return state.filter(toast => toast.id !== action.data.id)
        default:
            throw new Error();
    }
}

export default function ToastsProvider(props) {
    const [toasts, setToasts] = useReducer(toastsReducer, []);


    return <ToastsContext.Provider value={[toasts, setToasts]} {...props}/>
}
