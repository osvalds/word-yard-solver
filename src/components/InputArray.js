import React from "react"
import styled from "styled-components"
import Input from "./Input";
import Button, {SquaredButton} from "./Button";

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(32px, 42px));
  grid-gap: 8px
`

const ControlsWrapper = styled.div`
  width: 100%;
  margin-top: 12px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SizeContainer = styled.span`
  font-size: 20px;
`

export default function InputArray({inputArray, onChange}) {
    return (
        <>
            <InputWrapper>
                {inputArray.map((i, index) => {
                    return <Input
                        key={index}
                        value={i}
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
                    −
                </SquaredButton>
                <SizeContainer>
                    Vārda garums: {inputArray.length}
                </SizeContainer>
                <SquaredButton
                    size={42}
                    onClick={() => onChange({type: "increment"})}>
                    +
                </SquaredButton>
            </ControlsWrapper>
        </>
    )

}
