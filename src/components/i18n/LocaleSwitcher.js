import React, {useContext, useEffect} from "react";
import LocaleContext from "./context";
import styled from "styled-components"
import useT from "./Translate";

const Link = styled.a`
  user-select: none;
  text-align: right;
  color: #457B9D;
  text-decoration: underline;
  cursor: pointer;
  margin-bottom: 12px;
  font-weight: ${props => props.isActive ? "bold" : "normal"};
  margin-right: 12px;
`

const SwitcherWrapper = styled.div`
  display: flex;
`


export function LocaleSwitcher() {
    const [locale, setLocale] = useContext(LocaleContext);
    const title = useT("title")


    useEffect(() => {
        document.title = title;
    }, [locale])

    return (
        <SwitcherWrapper>
            <Link onClick={() => setLocale("lv")} isActive={locale === "lv"}>LV</Link>
            <Link onClick={() => setLocale("en")} isActive={locale === "en"}>EN</Link>
        </SwitcherWrapper>
    )

}
