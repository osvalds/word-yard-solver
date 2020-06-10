import React from "react";
import styled from "styled-components";
import Checkbox from "./Checkbox";

const ResultsWrapper = styled.div`
overflow: auto;
height: 100%;
`

const ResultsItemWrapper = styled.div`
  padding: 8px 0;
  display: flex;
  align-items: center;
`

const ResultText = styled.div`
  text-decoration: ${props => props.isUsed ? "line-through" : "none"};
`

const ResultItem = ({result, toggleUsed, isUsed}) => {
    return (
        <ResultsItemWrapper onClick={toggleUsed}>
            <Checkbox checked={isUsed}/>
            <ResultText isUsed={isUsed}>{result}</ResultText>
        </ResultsItemWrapper>
    )
}

export default function Results({results, usedResults, usedResultsDispatcher}) {
    if (results.data === null) {
        return null
    } else if (results.data.length === 0) {
        return (
            <div>
                Neko neatradām
            </div>
        )
    } else {
        return (
            <ResultsWrapper>
                {results.data.length > 0 &&
                results.data.map(r => {
                    return <ResultItem key={r}
                                       result={r}
                                       isUsed={usedResults.has(r)}
                                       toggleUsed={() => usedResultsDispatcher({type: "toggle", data: r})}
                    />
                })}
            </ResultsWrapper>
        )
    }
}
