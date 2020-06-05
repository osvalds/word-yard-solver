import React from "react"
import styled from "styled-components"

const ButtonStyled = styled.button`
  font-size: 30px;
  border: 1px solid black;
`

export default function Button(props) {
    return (
        <ButtonStyled {...props}/>
    )
}
