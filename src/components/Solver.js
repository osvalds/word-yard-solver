import {useRecoilValue} from "recoil";
import {CorpusQuery} from "../AppData";
import React, {useReducer, useState} from "react";
import styled from "styled-components";
import Iter from "es-iter"
import Button, {FullWidthButton} from "./Button";
import InputArray from "./InputArray";
import Input from "./Input";
import Results from "./Results";

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
        default:
            throw  new Error();
    }
}


export default function Solver() {
    const corpus = useRecoilValue(CorpusQuery)
    const [sourceLetters, setSourceLetters] = useState([])
    const [inputArray, dispatchInputArrayChange] = useReducer(reducer, ["", "", ""])
    const [results, setResults] = useState(null)

    const handleSourceChange = (evt) => {
        const val = evt.target.value
        setSourceLetters(val.toLowerCase().split(""))
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
            return regexp.test(r)
        })

        setResults(final)
    }

    return (
        <>
            <Title>Vārdu Dārza Suflieris</Title>
            <InputArray onChange={dispatchInputArrayChange} inputArray={inputArray}/>
            <FullWidthInput
                placeholder="Dotie burti"
                value={sourceLetters.join("").toUpperCase()}
                onChange={handleSourceChange}
                type="text"/>
            <FullWidthButton onClick={findResults}>
                Saki priekšā!
            </FullWidthButton>
            <Results results={results}/>
        </>
    )
}
