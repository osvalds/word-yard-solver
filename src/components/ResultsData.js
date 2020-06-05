import {atom, selector, selectorFamily} from "recoil";
import Iter from "es-iter";
import {CorpusQuery} from "../AppData";
import axios from "axios";

const findResults = ({sourceLetters, inputArray, corpus}) => {
    return new Promise(resolve => {

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

        resolve(final)
    })
}

export const SourceLettersAtom = atom({
    key: "SourceLettersAtom",
    default: []
})

export const InputArrayAtom = atom({
    key: "InputArrayAtom",
    default: ["", "", ""]
})

export const ResultsAtom = selector({
    key: "ResultsAtom",
    get: ({get}) => {
        return {
            sourceLetters: get(SourceLettersAtom),
            inputArray: get(InputArrayAtom)
        }
    },
    set: ({set}, {sourceLetters, inputArray}) => {
        set(SourceLettersAtom, sourceLetters)
        set(InputArrayAtom, inputArray)
    }
})

export const ResultsQuery = selector({
    key: "AllResults",
    get: async ({get}) => {
        console.log("getting");
        const {sourceLetters, inputArray} = get(ResultsAtom)
        const corpus = get(CorpusQuery);
        const resp = await findResults({sourceLetters, inputArray, corpus})
        return resp;
    }
})

