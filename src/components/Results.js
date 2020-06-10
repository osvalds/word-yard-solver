import React from "react";

export default function Results({results}) {
    if (results === null) {
        return null
    } else if (results.length === 0) {
        return (
            <div>
                Neko neatradām
            </div>
        )
    } else {
        return (
            results.length > 0 &&
            results.map(r => <div key={r}>{r}</div>)
        )
    }
}
