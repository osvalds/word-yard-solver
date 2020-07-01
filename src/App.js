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
import useT from "./components/i18n/Translate";

const fb = new Firebase()

function App() {
    const [isLoaded, setIsLoaded] = useState("loading")
    const [locale, setLocale] = useState("en")
    const workerRef = useRef(worker())
    const loadingText = useT("loadingCorpusText", locale)
    const errorLoading = useT("errorLoadingCorpus", locale)

    const handleMessage = useCallback((message) => {
        switch (message.data.type) {
            case "corpus-success":
                setIsLoaded("loaded")
                return;
            case "corpus-loading":
                setIsLoaded("loading")
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
        worker.loadCorpus(locale)

        return () => {
            worker.removeEventListener("message", handleMessage)
        }
    }, [handleMessage, locale])

    switch (isLoaded) {
        case "loading":
            return <InlineLoading text={loadingText}/>
        case "error":
            return <div>{errorLoading}</div>
        case "loaded":
        default:
            return (
                <ErrorBoundary>
                    <LocaleContext.Provider value={[locale, setLocale]}>
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
