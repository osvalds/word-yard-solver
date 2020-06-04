import {selector} from "recoil";
import axios from "axios";

export const CorpusQuery = selector({
    key: "Corpus",
    get: async () => {
        const result = await axios(process.env.PUBLIC_URL + "/corpus.json")

        try {
            return result.data;
        } catch (error) {
            throw error.response?.error || error.message
        }
    }
})
