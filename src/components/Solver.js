import React, {useCallback, useEffect, useReducer, useState} from "react";
import styled from "styled-components";
import {FullWidthButton} from "./Button";
import {ReactComponent as Clear} from "../icons/clear.svg";
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

const SearchWrapper = styled.div`
  position:relative;
`

const ClearSearch = styled(Clear)`
    position: absolute;
    height: 24px;
    width: 24px;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    fill: #c2c2c2;
`

function reducer(state, action) {
    switch (action.type) {
        case "increment":
            return [...state, ""].fill("")
        case "decrement":
            if (state.length === 0) {
                return []
            } else {
                return state.slice(0, -1).fill("")
            }
        case "change":
            let newArr = [...state];
            newArr[action.pos] = action.val[0]?.toLowerCase() || "";
            return newArr;
        case "reset":
            return [...state].fill("")
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

    const resetState = useCallback(() => {
        setSourceLetters([])
        setResults({state: "initial"})
    }, [setSourceLetters, setResults])

    return (
        <>
            <Title>Vārdu Dārza Suflieris</Title>
            <InputArray onChange={dispatchInputArrayChange}
                        inputArray={inputArray}
            />
            <SearchWrapper>
                <FullWidthInput
                    placeholder="Dotie burti"
                    value={sourceLetters.join("").toUpperCase()}
                    onChange={handleSourceChange}
                    type="text"/>
                {sourceLetters.length > 0 &&
                <ClearSearch onClick={resetState}/>}
            </SearchWrapper>
            <FullWidthButton onClick={handleSubmit}>
                Saki priekšā!
            </FullWidthButton>
            <SolverResults results={results}/>
        </>
    )
}
