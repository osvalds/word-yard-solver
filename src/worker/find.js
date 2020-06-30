import axios from "axios"
import Iter from "es-iter";
import {serializeInput} from "../Util";

let corpusDict = {};

// this does basically: https://stackoverflow.com/questions/8426178/given-a-string-find-all-its-permutations-that-are-a-word-in-dictionary
// but a simplified version
const buildCorpusDict = (corpus, locale) => {
    corpusDict[locale] = new Map();
    // change each word in corpus to alphabetically sorted string
    const corpusWordLettersSorted = corpus.map(word => [...word].sort((a, b) => a.localeCompare(b)).join(""))

    // This will populate a map where the alphabetically sorted string is key
    // and the corresponding values in the corpus will be value array
    for (let i = 0, l = corpus.length; i < l; i++) {
        const sortedKey = corpusWordLettersSorted[i];
        const value = corpus[i];

        const currentVal = corpusDict[locale].get(sortedKey);

        if(currentVal === undefined) {
            corpusDict[locale].set(sortedKey, [value])
        } else {
            corpusDict[locale].set(sortedKey, [...currentVal, value])
        }
    }
}

export const loadCorpus = async (locale) => {
    console.log(`/corpus_${locale}.json`)
    const result = await axios(process.env.PUBLIC_URL + `/corpus_${locale}.json`)

    try {
        buildCorpusDict(result.data, locale)
        postMessage({type: "corpus-success"})
    } catch (error) {
        postMessage({
            type: "corpus-error",
            message: error.response?.error || error.message
        })
    }
}

export const findResults = ({sourceLetters, inputArray, locale}) => {
    let results = [];

    // sort inputs alphabetically
    const sortedSource = [...sourceLetters].sort((a, b) => a.localeCompare(b));
    // since keys are sorted alphabetically, we don't need every permutation of the string.
    // we only need every combination, which will require much fewer searches
    const combinations = new Set([...new Iter(sortedSource).combinations(inputArray.length)].map(s => s.join("")))

    for (let c of combinations) {
        const resultValue = corpusDict[locale].get(c);

        if (resultValue !== undefined) {
            results = results.concat(resultValue)
        }
    }

    let scrambledLetters = sourceLetters.join("");

    for (let letter of inputArray) {
        if (letter !== "") {
            scrambledLetters.replace(letter, "")
        }
    }

    const regTempl = inputArray.map(i => {
        if (i === "") {
            return `[${scrambledLetters}]`
        } else {
            return i
        }
    }).join("")

    const final = results.filter(r => {
        const regexp = new RegExp(regTempl, "g");
        return regexp.test(r)
    })

    postMessage({
        type: "results-success",
        results: final,
        input: serializeInput({inputArray, sourceLetters})
    })
}
