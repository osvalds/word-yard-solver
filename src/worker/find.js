import axios from "axios"
import Iter from "es-iter";
import {serializeInput} from "../Util";

let corpus = null

export const loadCorpus = async () => {
    const result = await axios(process.env.PUBLIC_URL + "/corpus.json")

    try {
        corpus = result.data
        postMessage({type: "corpus-success"})
    } catch (error) {
        postMessage({
            type: "corpus-error",
            message: error.response?.error || error.message
        })
    }
}

export const findResults = ({sourceLetters, inputArray}) => {
    let results = [];

    const permutations = new Set([...new Iter(sourceLetters).permutations(inputArray.length)].map(s => s.join("")))

    for (let c of permutations) {
        const resultIndex = corpus.indexOf(c);

        if (resultIndex > -1) {
            results.push(corpus[resultIndex])
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
