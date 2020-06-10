import React from "react";

export default function Checkbox({checked, onClick}) {
    if (checked) {
        return <div onClick={onClick}>
            +
        </div>
    } else {
        return <div onClick={onClick}>

        </div>
    }
}
