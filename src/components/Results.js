import React from "react";
import styled from "styled-components";
import Checkbox from "./Checkbox";

const ResultsWrapper = styled.div`
margin: 12px -8px;
`

const ResultsItemWrapper = styled.div`
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  transition: .2s linear;
   
  &:hover {
    background-color: #d8e2e6;
  }
  
  @media (hover: none) {
   &:hover {
    background-color: transparent;
   }
}
`

const ResultText = styled.div`
  color: ${props => props.isUsed ? "#616161" : ""};
  margin-left: 8px;
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
