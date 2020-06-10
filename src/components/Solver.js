import {useRecoilState, useRecoilValue, useRecoilValueLoadable, useResetRecoilState, useSetRecoilState} from "recoil";
import {CorpusQuery} from "../AppData";
import React, {Suspense, useReducer, useState} from "react";
import styled from "styled-components";
import Iter from "es-iter"
import Button, {FullWidthButton} from "./Button";
import InputArray from "./InputArray";
import Input from "./Input";
import Results from "./Results";
import {InputArrayAtom, ResultsAtom, ResultsQuery, SourceLettersAtom} from "./ResultsData";
import ErrorBoundary from "./ErrorBoundary";

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

function SolverResults() {
    // const sourceLettersR = useRecoilValue(SourceLettersAtom)
    // const inputArrayR = useRecoilValue(InputArrayAtom)
    const results = useRecoilValue(ResultsQuery)
    return <Results results={results}/>
}

export default function Solver() {
    const [sourceLetters, setSourceLetters] = useState([])
    const [inputArray, dispatchInputArrayChange] = useReducer(reducer, ["", "", ""])
    const setResults = useSetRecoilState(ResultsAtom)

    const handleSourceChange = (evt) => {
        const val = evt.target.value
        dispatchInputArrayChange({type: "reset"});
        setSourceLetters(val.toLowerCase().split(""))
    }

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
            <FullWidthButton onClick={() => setResults({sourceLetters, inputArray})}>
                Saki priekšā!
            </FullWidthButton>
            <Suspense fallback={<div>Ielādē rezultātus</div>}>
                <SolverResults/>
            </Suspense>
        </>
    )
}
