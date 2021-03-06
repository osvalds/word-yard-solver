import React, {useCallback, useContext, useEffect, useReducer, useRef, useState} from "react";
import styled from "styled-components";
import {FullWidthButton} from "./Button";
import {ReactComponent as Clear} from "../icons/clear.svg";
import InputArray from "./InputArray";
import {FullWidthInput} from "./Input";
import Results from "./Results";
import {serializeInput} from "../Util";
import {InlineLoading} from "./InlineLoading";
import {SubmitMissing} from "./SubmitMissing";
import {LocaleSwitcher} from "./i18n/LocaleSwitcher";
import useT from "./i18n/Translate"
import LocaleContext from "./i18n/context";
//import {ParseXML} from "./ParseXML";

const Title = styled.h1`
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: bold;
  text-align: center;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
    cursor: pointer;
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
            throw new Error();
    }
}

function SolverResults(props) {
    const {results} = props;

    switch (results.state) {
        case "initial":
            return null
        case "loading":
            return <InlineLoading text={"Lādē rezultātus"}/>
        default:
            return <Results {...props}/>
    }
}

function usedResultsReducer(state, action) {
    switch (action.type) {
        case "toggle":
            if (state.has(action.data)) {
                let nState = new Set(state);
                nState.delete(action.data);
                return nState
            } else {
                return new Set(state).add(action.data);
            }
        case "reset":
            return new Set();
        default:
            throw new Error();
    }
}

export default function Solver({workerRef}) {
    const [sourceLetters, setSourceLetters] = useState([])
    const [inputArray, dispatchInputArrayChange] = useReducer(reducer, ["", "", ""])
    const [results, setResults] = useState({state: "initial"})
    const [usedResults, dispatchUsedResultsChange] = useReducer(usedResultsReducer, new Set())
    const [locale] = useContext(LocaleContext)
    const [search, setSearch] = useState("");
    const inputRef = useRef(null)

    const handleSourceChange = (evt) => {
        const val = evt.target.value
        dispatchInputArrayChange({type: "reset"})
        setSourceLetters(val.toLowerCase().split(""))
        dispatchUsedResultsChange({type: "reset"})
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
    }, [handleWorkerMessage, workerRef])

    const handleSubmit = useCallback(() => {
        const newsearch = serializeInput({inputArray, sourceLetters});
        setSearch(newsearch);
        workerRef.current.findResults({inputArray, sourceLetters, locale})
        setResults({state: "loading"})
    }, [inputArray, sourceLetters, setResults, setSearch, workerRef])

    const resetState = useCallback(() => {
        setSourceLetters([])
        setResults({state: "initial"})
        dispatchUsedResultsChange({type: "reset"})
        dispatchInputArrayChange({type: "reset"})
        inputRef.current.focus();
    }, [setSourceLetters, setResults, dispatchUsedResultsChange, dispatchInputArrayChange])

    return (
        <>
            <Header>
                <LocaleSwitcher/>
                <SubmitMissing/>
            </Header>
            <Title>{useT("title")}</Title>
            <InputArray onChange={dispatchInputArrayChange}
                        inputArray={inputArray}
            />
            <SearchWrapper>
                <FullWidthInput
                    placeholder={useT("givenLetters")}
                    value={sourceLetters.join("").toUpperCase()}
                    onChange={handleSourceChange}
                    ref={inputRef}
                    type="text"/>
                {sourceLetters.length > 0 &&
                <ClearSearch onClick={resetState}/>}
            </SearchWrapper>
            <FullWidthButton onClick={handleSubmit}>
                {useT("solve")}
            </FullWidthButton>
            <SolverResults results={results}
                           usedResultsDispatcher={dispatchUsedResultsChange}
                           usedResults={usedResults}
            />
            {/*<ParseXML/>*/}
        </>
    )
}
