import React from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  font-size: 20px;
  padding: 8px;
  display: block;
  text-align: center;
`

export default function Input(props) {

    return (
        <StyledInput {...props}/>
    )
}
