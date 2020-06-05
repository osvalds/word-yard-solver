import React from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  font-size: 20px;
  padding: 8px;
  display: block;
  text-align: center;
  border: 1px solid #457B9D;
  border-radius: 5px;
`

export default function Input(props) {

    return (
        <StyledInput {...props}/>
    )
}
