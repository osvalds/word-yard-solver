import React from "react"
import styled from "styled-components";
import {Ellipsis} from "react-awesome-spinners";

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const LoadingText = styled.div`
  margin-left: 12px;
`


export function InlineLoading({text}) {
    return <LoadingWrapper>
        <Ellipsis color="#2ec4b6"/>
        <LoadingText>
            {text}
        </LoadingText>
    </LoadingWrapper>
}
