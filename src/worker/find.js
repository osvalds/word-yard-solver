import axios from "axios"

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
