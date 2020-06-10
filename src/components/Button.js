import React from "react"
import styled from "styled-components"

const ButtonStyled = styled.button`
  font-size: 24px;
  border-radius: 5px;
  border: none;
  background-color: #2ec4b6;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: ${42 + 16}px;
  padding: 12px 8px;
  user-select: none;
`

const ButtonSquaredStyled = styled(ButtonStyled)`
  //border: 1px solid red;
  width: ${props => props.size || 16}px;
  height: ${props => props.size || 16}px;
`

function Button(props) {
    return (
        <ButtonStyled {...props}/>
    )
}

export function SquaredButton(props) {
    return (
        <ButtonSquaredStyled {...props}/>
    )
}

export const FullWidthButton = styled(Button)`
  width: 100%;
  margin-top: 12px;
  padding: 0;
  height: 42px;
  font-size: 20px;
`
