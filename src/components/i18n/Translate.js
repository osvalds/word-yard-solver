import {useContext} from "react";
import LocaleContext from "./context";
import {Strings} from "./Strings"

export default function useT(k) {
    const [locale] = useContext(LocaleContext)

    return Strings?.[k]?.[locale] || k
}
