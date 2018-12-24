const { readFileSync } = require("fs");

const input = readFileSync("input-day3.txt").toString().split('\n').filter(Boolean);
// const input = `#1 @ 1,3: 4x4
// #2 @ 3,1: 4x4
// #3 @ 5,5: 2x2`.split("\n");

function parse(line) {
  const [name, l, t, w, h] = line.split(/[:,@ x]+/);

  return {
    name,
    l: Number(l),
    t: Number(t),
    w: Number(w),
    h: Number(h)
  };
}

let xCount = 0;

function set(t, l, value) {
  if (!fabric.has(t)) {
    fabric.set(t, new Map());
  }
  if(fabric.get(t).has(l)) {
    if(fabric.get(t).get(l) !== 'X') {
      fabric.get(t).set(l, 'X');
      // console.log("setting", t, l, 'X');
      xCount++;
    } else {
      // console.log("again:", t, l, 'X');
    }

  } else {
    fabric.get(t).set(l, value);
    // console.log("setting", t, l, value);

  }
}

function setAll({ name, l, t, w, h }) {
  for (let tIndex = t; tIndex < t + h; tIndex++) {
    for (let lIndex = l; lIndex < l + w; lIndex++) {
      set(tIndex, lIndex, name);
    }
  }
}

function claimIntact(parsed) {
  const { name, l, t, w, h } = parsed;
  for (let tIndex = t; tIndex < t + h; tIndex++) {
    for (let lIndex = l; lIndex < l + w; lIndex++) {
      if(fabric.get(tIndex).get(lIndex) === 'X') {
        return false;
      }
    }
  }
  return parsed;
}

const fabric = new Map();
const parsedInput = input.map(parse);
parsedInput.forEach(setAll);
console.log(xCount);
console.log(parsedInput.map(claimIntact).filter(Boolean));
