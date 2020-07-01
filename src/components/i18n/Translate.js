import {useContext} from "react";
import LocaleContext from "./context";
import {Strings} from "./Strings"

export default function useT(k, localeOverride = null) {
    const [contextLocale] = useContext(LocaleContext)
    const locale = localeOverride || contextLocale

    return Strings?.[k]?.[locale] || k
}
