import React, {Suspense} from 'react';
import {RecoilRoot, useRecoilValue} from "recoil";
import './App.css';
import ErrorBoundary from "./components/ErrorBoundary";
import {CorpusQuery} from "./AppData";

function Shaq() {
    const corpus = useRecoilValue(CorpusQuery)

    return (
        <ul>
            <li>{corpus[0]}</li>
        </ul>
    )
}

function App() {
    return (
        <RecoilRoot>
            <ErrorBoundary>
                <Suspense fallback={<div>Ielādē latviešu valodu...</div>}>
                    <Shaq/>
                </Suspense>
            </ErrorBoundary>
        </RecoilRoot>
    );
}

export default App;
