import React from "react"
import styled from "styled-components"
import Input from "./Input";
import {SquaredButton} from "./Button";
import {ReactComponent as Add} from "../icons/add.svg";
import {ReactComponent as Remove} from "../icons/remove.svg";

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(32px, 42px));
  grid-gap: 8px
`

const ControlsWrapper = styled.div`
  width: 100%;
  margin-top: 12px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SizeContainer = styled.span`
  user-select: none;
  font-size: 20px;
`

const RemoveStyled = styled(Remove)`
  fill: white;
  width: 20px;
  height: 20px;
`

const AddStyled = styled(Add)`
  fill: white;
  width: 20px;
  height: 20px;
`

export default function InputArray({inputArray, onChange}) {
    return (
        <>
            <InputWrapper>
                {inputArray.map((letter, index) => {
                    return <Input
                        key={index}
                        value={letter.toUpperCase()}
                        onChange={(evt) => onChange({
                            type: "change",
                            val: evt.target.value,
                            pos: index
                        })}
                        type="text"/>
                })}
            </InputWrapper>
            <ControlsWrapper>
                <SquaredButton
                    size={42}
                    onClick={() => onChange({type: "decrement"})}>
                    <RemoveStyled/>
                </SquaredButton>
                <SizeContainer onClick={(e) => {
                    e.preventDefault();
                    onChange({type: "reset"})
                }}>
                    Vārda garums: {inputArray.length}
                </SizeContainer>
                <SquaredButton
                    size={42}
                    onClick={() => onChange({type: "increment"})}>
                    <AddStyled/>
                </SquaredButton>
            </ControlsWrapper>
        </>
    )
}
