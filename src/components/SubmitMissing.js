import React, {useContext, useState} from "react";
import {FirebaseContext} from "./Firebase";
import styled from "styled-components";
import {FullWidthInput, Input} from "./Input";
import {Button, FullWidthButton} from "./Button";

const SubmitStyled = styled.div`
  text-align: right;
  color: #457B9D;
  text-decoration: underline;
  cursor: pointer;
  margin-bottom: 12px;
`

const ModalWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  background: var(--background);
  padding: 16px
`

const StyledLabel = styled.label`

`

const Paragraph = styled.p`
  line-height: 1.5;
  font-size: 16px;
  margin-bottom: 16px;
`

function SubmitMissingModal({setShowModal}) {
    const firebase = useContext(FirebaseContext)
    const [missing, setMissing] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = () => {
        firebase.db.collection("missing").add({lemma: missing})
        setShowModal(false);
    }

    return (
        <ModalWrapper>
            <div>
                <Paragraph>
                    Vārdu Dārza Suflieris izmanto <a>LUMII Tēzaura</a> datu kopu, lai meklētu potenciālos atrisinājumus.
                    Kaut arī datu kopā ir vairāk nekā 300 000 ierakstu, Vārdu Dārzā mēdz parādīties vārdi, kurus Suflieris neprot atminēt.
                    Suflierim problēmas arī sagādā vārda locījumi sieviešu dzimtē.
                </Paragraph>
                <Paragraph>
                    Ja esi uzdūries/-usies uz vārda, kuru Suflieris nevar atrisināt, bet Tev ir sanācis to izdarīt, iesūti risinājumu un es papildināšu
                    datu kopu ar Tavu atminējumu.
                </Paragraph>
            </div>

            <form onSubmit={(event) => {
                event.preventDefault();
                onSubmit()
            }}>
                <StyledLabel for="solution">
                    Atrisinājums, kuru suflieris nevarēja atrast
                </StyledLabel>
                <FullWidthInput value={missing}
                       id="solution"
                       style={{textAlign: "left"}}
                       onChange={(evt) => setMissing(evt.target.value)}/>
                <FullWidthButton onClick={onSubmit}>
                    Iesūtīt
                </FullWidthButton>
            </form>
        </ModalWrapper>
    )
}

export function SubmitMissing() {
    const [showModal, setShowModal] = useState(false)

    const showSubmit = () => {
        setShowModal(true)

    }

    return (
        <>
            <SubmitStyled onClick={showSubmit}>
                Neatrodi atbildi?
            </SubmitStyled>
            {showModal &&
            <SubmitMissingModal setShowModal={setShowModal}/>}
        </>
    )
}
