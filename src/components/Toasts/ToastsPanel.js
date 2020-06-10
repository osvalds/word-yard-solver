import React, {useEffect} from "react";
import {useToasts} from "./ToastsProvider";
import styled from "styled-components";


const InlineNotificaitonWrapper = styled.div`
    border-left: 3px solid #4589ff;
    background: #393939;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    height: auto;
    min-height: 3rem;
    min-width: 18rem;
    max-width: 18rem;
    width: 100%;
    align-items: center;
    font-weight: bold;
    padding-left: 16px;
    color: #fff;
    margin-top: 1rem;
    margin-bottom: 1rem;
`

function InlineNotification({title}) {
    return (
        <InlineNotificaitonWrapper>
            {title}
        </InlineNotificaitonWrapper>
    )
}


function ToastNotification({id, title, subtitle, duration = 20, kind = "info", closeToast, children, isPersistant, hideCloseButton}) {

    useEffect(() => {
        if (isPersistant || !duration || duration === 0 || duration === "0") return;

        const timer = setTimeout(() => {
            closeToast()
        }, duration * 1000)
        return () => clearTimeout(timer);

        //eslint-disable-next-line
    }, [])

    return <InlineNotification title={title}/>
}

const StyledToast = styled.div`
  position: fixed;
  max-width: 400px;
  width: 100%;
  z-index: 9002;
  left: 20px;
  bottom: 20px;
`

export default function ToastsPanel() {
    const [toasts, setToasts] = useToasts();

    if (toasts?.length > 0) {
        return (
            <StyledToast>
                {toasts.map(toast => (
                    <ToastNotification {...toast}
                                       key={toast.id}
                                       closeToast={() => setToasts({
                                           action: "remove",
                                           data: {id: toast.id}
                                       })}/>
                ))}
            </StyledToast>
        )
    } else {
        return null;
    }
}
