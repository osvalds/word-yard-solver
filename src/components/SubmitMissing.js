import React, {useContext, useEffect, useState} from "react";
import {FirebaseContext} from "./Firebase";
import styled from "styled-components";
import {FullWidthInput} from "./Input";
import {FullWidthButton} from "./Button";
import {useToasts} from "./Toasts/ToastsProvider";
import useT from "./i18n/Translate";

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
                {useT("close")}
            </CloseModal>
            <Paragraph dangerouslySetInnerHTML={{ __html: useT("solutionExplainer1") }}/>
            <Paragraph>
                {useT("solutionExplainer2")}
            </Paragraph>

            <form onSubmit={(event) => {
                event.preventDefault();
                onSubmit()
            }}>
                <StyledLabel htmlFor="solution">
                    {useT("solutionLabel")}
                </StyledLabel>
                <FullWidthInput value={missing}
                                autocomplete="off"
                                id="solution"
                                placeholder={useT("word")}
                                style={{textAlign: "left"}}
                                onChange={(evt) => setMissing(evt.target.value)}/>
                <FullWidthButton onClick={onSubmit}>
                    {useT("submit")}
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
                {useT("didntFind")}
            </SubmitStyled>
            {showModal &&
            <SubmitMissingModal setShowModal={setShowModal}/>}
        </>
    )
}
