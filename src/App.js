import React, {Suspense} from 'react';
import {RecoilRoot} from "recoil";
import './App.css';
import ErrorBoundary from "./components/ErrorBoundary";
import Solver from "./components/Solver";

function App() {
    return (
        <RecoilRoot>
            <ErrorBoundary>
                <Suspense fallback={<div>Ielādē latviešu valodu...</div>}>
                    <Solver/>
                </Suspense>
            </ErrorBoundary>
        </RecoilRoot>
    );
}

export default App;
