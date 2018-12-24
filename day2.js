const { readFileSync } = require("fs");

function hasTimes(id) {
  const splitSorted = id.split("").sort();
  let count;
  let currentChar;
  let twice = false;
  let thrice = false;
  splitSorted.forEach(char => {
    if (char !== currentChar) {
      if (count === 2) {
        twice = char;
      }
      if (count === 3) {
        thrice = char;
      }
      count = 0;
      currentChar = char;
    }
    count++;
  });

  if (count === 2) {
    twice = splitSorted[splitSorted.length - 1];
  }
  if (count === 3) {
    thrice = splitSorted[splitSorted.length - 1];
  }

  return {
    twice,
    thrice
  };
}

const input = readFileSync("inputday2.txt");

// part 1
const checked = input
  .toString()
  .split("\n")
  .map(hasTimes);
const numberTwice = checked.filter(({ twice }) => !!twice).length;
const numberThrice = checked.filter(({ thrice }) => !!thrice).length;
console.log(numberThrice * numberTwice);

// part 2
const exampleInput = `abcde
fghij
klmno
pqrst
fguij
axcye
wvxyz`.split("\n");

function getSame(a, b) {
  const bSplit = b.split("");
  return a
    .split("")
    .map((aChar, i) => aChar === bSplit[i] && aChar)
    .filter(Boolean)
    .join("");
}

function numberArray(start, finish) {
  return Array.from({ length: finish - start })
    .fill(0)
    .map((_, i) => i + start);
}

function sortedComparison(inputStrings) {
  return []
    .concat(
      ...inputStrings.map((input, index) => {
        return numberArray(index + 1, inputStrings.length).map(index2 => {
          return [
            input,
            inputStrings[index2],
            getSame(input, inputStrings[index2])
          ];
        });
      })
    )
    .sort(([a1, b1, same1], [a2, b2, same2]) => same2.length - same1.length);
}

console.log(sortedComparison(input.toString().split("\n"))[0]);
