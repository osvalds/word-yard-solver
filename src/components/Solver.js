import {useRecoilValue} from "recoil";
import {CorpusQuery} from "../AppData";
import React, {useReducer, useState} from "react";
import Iter from "es-iter"

function reducer(state, action) {
    switch (action.type) {
        case "increment":
            return [...state, ""]
        case "decrement":
            if (state.length === 0) {
                return []
            } else {
                return state.slice(0, -1)
            }
        case "change":
            let newArr = [...state];
            newArr[action.pos] = action.val
            return newArr;
        default:
            throw  new Error();
    }
}


export default function Solver() {
    const corpus = useRecoilValue(CorpusQuery)
    const [sourceLetters, setSourceLetters] = useState([])
    const [inputArray, dispatchInputArrayChange] = useReducer(reducer, ["", "", ""])
    const [results, setResults] = useState([])

    const handleSourceChange = (evt) => {
        const val = evt.target.value
        setSourceLetters(val.split(""))
    }


    const findResults = () => {
        let results = [];

        const permutations = new Set([...new Iter(sourceLetters).permutations(inputArray.length)].map(s => s.join("")))

        for (let c of permutations) {
            const resultIndex = corpus.indexOf(c);

            if (resultIndex > -1) {
                results.push(corpus[resultIndex])
            }
        }

        let scrambledLetters = sourceLetters.join("");

        for (let letter of inputArray) {
            if (letter !== "") {
                scrambledLetters.replace(letter, "")
            }
        }

        const regTempl = inputArray.map(i => {
            if (i === "") {
                return `[${scrambledLetters}]`
            } else {
                return i
            }
        }).join("")

        const final = results.filter(r => {
            const regexp = new RegExp(regTempl, "g");
            // console.log(regexp)
            // console.log(r)
            return regexp.test(r)
        })

        setResults(final)
        // console.log(regTempl);
        // console.log(results);
    }

    return (
        <>
            <div>
                Minamā vārda garums:
                <button onClick={() => dispatchInputArrayChange({type: "decrement"})}>
                    -
                </button>
                <span>{inputArray.length}</span>
                <button onClick={() => dispatchInputArrayChange({type: "increment"})}>
                    +
                </button>
            </div>
            <ul>
                {inputArray.map((i, index) => {
                    return <li key={index}>
                        <input
                            value={i}
                            onChange={(evt) => dispatchInputArrayChange({
                                type: "change",
                                val: evt.target.value,
                                pos: index
                            })}
                            type="text"/>
                    </li>
                })}
            </ul>

            <div>Dotie burti:
                {sourceLetters.length > 0 &&
                sourceLetters.map((letter, index) => {
                        return <span key={index}>'{letter}'
                            {index < sourceLetters.length - 1 && ","}
                        </span>
                    }
                )}
            </div>
            <input
                onChange={handleSourceChange}
                type="text"/>


            <button onClick={findResults}>
                Find results
            </button>
            {results.length > 0 &&
            results.map(r => <div key={r}>{r}</div>)
            }

        </>
    )
}
