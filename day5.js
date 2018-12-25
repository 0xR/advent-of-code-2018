const { readFileSync } = require("fs");

const input = readFileSync("input-day5.txt")
  .toString()
  .trim();
// const input = "dabAcCaCBAcCcaDA";

function getOtherCase(char) {
  if ("a" <= char && char <= "z") {
    return char.toUpperCase();
  }
  return char.toLowerCase();
}

function react(chars) {
  // console.log("react:", line);
  // const chars = line.split("");
  let reactionIndex;
  chars.find((char, i) => {
    if (i < chars.length - 2) {
      if (getOtherCase(char) === chars[i + 1]) {
        reactionIndex = i;
        return true;
      }
    }
    return false;
  });
  if (reactionIndex !== undefined) {
    return [
      ...chars.slice(0, reactionIndex),
      ...chars.slice(reactionIndex + 2, chars.length)
    ];
  } else {
    return chars;
  }
}

function reactAll(line) {
  let previousLine;
  let newLine = line;
  while (newLine.length !== (previousLine && previousLine.length)) {
    previousLine = newLine;
    newLine = react(newLine);
    // console.log(previousLine, newLine);
  }
  return newLine;
}

function reactAllRemovingone(line) {
  const result = [];

  const chars = line .split("");
  for (let i = 0; i < 26; i++) {
    const start = Date.now();
    const toRemove = String.fromCharCode('a'.charCodeAt(0) + i);
    const filteredChars = chars
      .filter(c => c !== toRemove && c !== getOtherCase(toRemove));
    const reactionResult = reactAll(filteredChars);
    console.log("remove", toRemove, reactionResult.length);
    result.push([toRemove, reactionResult.length]);
    console.log(Date.now() - start);
  }
  return result.sort(([i1, l1], [i2, l2]) => l2 - l1);
}

console.log(reactAllRemovingone(input));
