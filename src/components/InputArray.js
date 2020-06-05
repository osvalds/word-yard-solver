import React from "react"
import styled from "styled-components"
import Input from "./Input";

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(32px, 43px));
  grid-gap: 8px
`

export default function InputArray({inputArray, onChange}) {
    return (
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
    )

}
