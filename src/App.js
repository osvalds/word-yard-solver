import React, {useCallback, useEffect, useRef, useState} from 'react';
import './App.css';
import ErrorBoundary from "./components/ErrorBoundary";
import Solver from "./components/Solver";
import worker from "workerize-loader!./worker/find"// eslint-disable-line import/no-webpack-loader-syntax
import {InlineLoading} from "./components/InlineLoading";
import Firebase, {FirebaseContext} from "./components/Firebase"
import ToastsProvider from "./components/Toasts/ToastsProvider";
import ToastsPanel from "./components/Toasts/ToastsPanel";
import LocaleContext from "./components/i18n/context";

const fb = new Firebase()

function App() {
    const [isLoaded, setIsLoaded] = useState("loading")
    const useLocale = useState("lv")
    const workerRef = useRef(worker())

    const handleMessage = useCallback((message) => {
        switch (message.data.type) {
            case "corpus-success":
                setIsLoaded("loaded")
                return;
            case "corpus-error":
                setIsLoaded("error")
                throw message.message;
            default:
                return;

        }
    }, [setIsLoaded])

    useEffect(() => {
        const worker = workerRef.current;

        worker.addEventListener("message", handleMessage)
        worker.loadCorpus()

        return () => {
            worker.removeEventListener("message", handleMessage)
        }
    }, [handleMessage])

    switch (isLoaded) {
        case "loading":
            return <InlineLoading text="Lādē latviešu valodu"/>
        case "error":
            return <div>Kļūda ielādējot latviešu valodu</div>
        case "loaded":
        default:
            return (
                <ErrorBoundary>
                    <LocaleContext.Provider value={useLocale}>
                        <FirebaseContext.Provider value={fb}>
                            <ToastsProvider>
                                <Solver workerRef={workerRef}/>
                                <ToastsPanel/>
                            </ToastsProvider>
                        </FirebaseContext.Provider>
                    </LocaleContext.Provider>
                </ErrorBoundary>
            );
    }
}

export default App;
