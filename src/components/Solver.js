import React, {useCallback, useEffect, useReducer, useState} from "react";
import styled from "styled-components";
import Button, {FullWidthButton} from "./Button";
import InputArray from "./InputArray";
import Input from "./Input";
import Results from "./Results";
import {serializeInput} from "../Util";

const Title = styled.h1`
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: bold;
  text-align: center;
`

const FullWidthInput = styled(Input)`
  width: 100%;
`

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
            newArr[action.pos] = action.val[0]?.toLowerCase() || "";
            return newArr;
        case "reset":
            return state.map(el => "")
        default:
            throw  new Error();
    }
}

function SolverResults({results}) {
    switch (results.state) {
        case "initial":
            return null
        case "loading":
            return <div>Lādē rezultātus</div>
        default:
            return <Results results={results.data}/>
    }
}

export default function Solver({workerRef}) {
    const [sourceLetters, setSourceLetters] = useState([])
    const [inputArray, dispatchInputArrayChange] = useReducer(reducer, ["", "", ""])
    const [results, setResults] = useState({state: "initial"})
    const [search, setSearch] = useState("");

    const handleSourceChange = (evt) => {
        const val = evt.target.value
        dispatchInputArrayChange({type: "reset"})
        setSourceLetters(val.toLowerCase().split(""))
    }

    const handleWorkerMessage = useCallback((message) => {
        switch (message.data.type) {
            case "results-success":
                if (message.data.input === search) {
                    setResults({
                        state: "loaded",
                        data: message.data.results
                    })
                }
                break;
            default:
                break;
        }
    }, [setResults, search])

    useEffect(() => {
        const worker = workerRef.current;
        worker.addEventListener("message", handleWorkerMessage)

        return () => {
            worker.removeEventListener("message", handleWorkerMessage)
        }
    }, [handleWorkerMessage])

    const handleSubmit = useCallback(() => {
        const newsearch = serializeInput({inputArray, sourceLetters});
        setSearch(newsearch);
        workerRef.current.findResults({inputArray, sourceLetters})
        setResults({state: "loading"})
    }, [inputArray, sourceLetters, setResults, setSearch])

    return (
        <>
            <Title>Vārdu Dārza Suflieris</Title>
            <InputArray onChange={dispatchInputArrayChange}
                        inputArray={inputArray}
                        onCountChange={() => dispatchInputArrayChange("clear")}
            />
            <FullWidthInput
                placeholder="Dotie burti"
                value={sourceLetters.join("").toUpperCase()}
                onChange={handleSourceChange}
                type="text"/>
            <FullWidthButton onClick={handleSubmit}>
                Saki priekšā!
            </FullWidthButton>
            <SolverResults results={results}/>
        </>
    )
}
