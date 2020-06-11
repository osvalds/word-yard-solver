import React from "react"
import {FullWidthButton} from "./Button";
import axios from "axios";

function saveTextAsFile(textToWrite) {
    var textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
    var fileNameToSaveAs = "corpus.json"
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        // downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

String.prototype.charAtIsUpper = function (atpos){
    var chr = this.charAt(atpos);
    return /[A-Z]|[\u0080-\u024F]/.test(chr) && chr === chr.toUpperCase();
};

export function ParseXML() {

    const parseXml = async () => {
        const resp = await axios(process.env.PUBLIC_URL + "/tezaurs.xml")
        let xmlStr = resp.data;
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlStr, "text/xml");
        let lemmas = xmlDoc.getElementsByTagName("form")
        let results = [];
        let setResults = new Set()

        for (let i = 0, l = lemmas.length; i < l; i++) {
            const newStr = lemmas[i].textContent;
            let character = newStr.charAt(i);
            if (!newStr.charAtIsUpper(0)) {
                setResults.add(newStr)
            }
            results.push(newStr)
        }

        saveTextAsFile(JSON.stringify(Array.from(setResults)))

        console.log(setResults.size)
        console.log(results.length)

    }

    const buildDict = async () => {
        const resp = await axios(process.env.PUBLIC_URL + "/corpus_full.json")
        const inputArray = resp.data
        const sortedInputArray = inputArray.map(word => [...word].sort((a, b) => a.localeCompare(b)).join(""))

        let resultMap = new Map();
        const t1 = performance.now();
        for (let i = 0, l = inputArray.length; i < l; i++) {
            const sortedKey = sortedInputArray[i];
            const value = inputArray[i];

            const currentVal = resultMap.get(sortedKey);

            if(currentVal === undefined) {
                resultMap.set(sortedKey, [value])
            } else {
                resultMap.set(sortedKey, [...currentVal, value])
            }
        }
        const t2 = performance.now();
        // console.log(t2-t1)

        for (let [key, value] of resultMap) {
            if (value.length < 2) {
                resultMap.delete(key)
            }
        }

        // find word with most palindromes
        let mapByLength = new Map([...resultMap.entries()].sort((a, b) => {
            return a[0].length - b[0].length
        }))

        console.log(mapByLength)

        // console.log(resultMap);

    }

    return (
        <>
            <FullWidthButton onClick={parseXml}>
                Parsēt corpusu
            </FullWidthButton>
            <FullWidthButton onClick={buildDict}>
                Build sorted dict
            </FullWidthButton>
        </>
    )
}
