import React, {useContext, useEffect, useState} from "react";
import {FirebaseContext} from "./Firebase";
import styled from "styled-components";
import {FullWidthInput} from "./Input";
import {FullWidthButton} from "./Button";
import {useToasts} from "./Toasts/ToastsProvider";

const SubmitStyled = styled.div`
  user-select: none;
  text-align: right;
  color: #457B9D;
  text-decoration: underline;
  cursor: pointer;
  margin-bottom: 12px;
`

const ModalWrapper = styled.div`
  position: fixed;
  width: 100%;
  max-width: 500px;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  overflow: auto;
  z-index: 1000;
  background: var(--background);
  padding: 16px
`

const StyledLabel = styled.label`
  display: block;
  margin-top: 24px;
  margin-bottom: 8px;
`

const Paragraph = styled.p`
  line-height: 1.5;
  font-size: 16px;
  margin-bottom: 16px;
`

const A = styled.a`
  text-decoration: underline;
  color: #457B9D;
  cursor: pointer;
`

const CloseModal = styled(A)`
  padding: 8px 0 16px;
  display: block;
  text-align: right;
`

function SubmitMissingModal({setShowModal}) {
    const firebase = useContext(FirebaseContext)
    const [missing, setMissing] = useState("")
    //eslint-disable-next-line
    const [toasts, setToasts] = useToasts();

    const onSubmit = () => {
        firebase.db.collection("missing").add({lemma: missing}).then(resp => {
            setToasts({
                action: "add",
                data: {
                    duration: 5,
                    title: "Paldies, saņēmu!"
                }
            })
        })
        setShowModal(false);
    }

    return (
        <ModalWrapper>
            <CloseModal onClick={() => setShowModal(false)}>
                Aizvērt
            </CloseModal>
            <Paragraph>
                Vārdu Dārza Suflieris izmanto <A href="https://github.com/LUMII-AILab/Tezaurs" target="_blank"
                                                 rel="noreferrer">LUMII
                Tēzaura</A> datu kopu, lai meklētu potenciālos atrisinājumus.
                Kaut arī datu kopā ir vairāk nekā 300 000 ierakstu, Vārdu Dārzā mēdz parādīties vārdi, kurus
                Suflieris neprot atminēt.
                Suflierim problēmas arī sagādā vārda locījumi sieviešu dzimtē.
            </Paragraph>
            <Paragraph>
                Ja esi uzdūries/-usies uz vārda, kuru Suflieris nevar atrisināt, bet Tev ir sanācis to izdarīt,
                iesūti risinājumu un es papildināšu
                datu kopu ar Tavu atminējumu.
            </Paragraph>

            <form onSubmit={(event) => {
                event.preventDefault();
                onSubmit()
            }}>
                <StyledLabel htmlFor="solution">
                    Atrisinājums, kuru suflieris nevarēja atrast:
                </StyledLabel>
                <FullWidthInput value={missing}
                                autocomplete="off"
                                id="solution"
                                placeholder="Vārds"
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

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [showModal])

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
