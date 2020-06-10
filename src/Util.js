export function serializeInput({inputArray, sourceLetters}) {
    return `${sourceLetters.join("")}:${inputArray.length}:${inputArray.join("")}`
}
