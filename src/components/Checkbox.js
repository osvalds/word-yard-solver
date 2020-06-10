import React from "react";
import {ReactComponent as Checked} from "../icons/check-box.svg";
import {ReactComponent as Blank} from "../icons/blank-check-box.svg";
import styled from "styled-components";

const BlankCheckbox = styled(Blank)`
  width: 24px;
  height: 24px;
  fill: #457B9D;
`

const CheckedCheckBox = styled(Checked)`
  width: 24px;
  height: 24px;
  fill: #616161;
`

export default function Checkbox({checked}) {
    if (checked) {
        return <CheckedCheckBox/>
    } else {
        return <BlankCheckbox/>
    }
}
