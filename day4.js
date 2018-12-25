const { readFileSync } = require("fs");

const input = readFileSync("input-day4.txt").toString().split('\n').filter(Boolean).sort();
// const input = `[1518-11-01 00:00] Guard #10 begins shift
// [1518-11-01 00:05] falls asleep
// [1518-11-01 00:25] wakes up
// [1518-11-01 00:30] falls asleep
// [1518-11-01 00:55] wakes up
// [1518-11-01 23:58] Guard #99 begins shift
// [1518-11-02 00:40] falls asleep
// [1518-11-02 00:50] wakes up
// [1518-11-03 00:05] Guard #10 begins shift
// [1518-11-03 00:24] falls asleep
// [1518-11-03 00:29] wakes up
// [1518-11-04 00:02] Guard #99 begins shift
// [1518-11-04 00:36] falls asleep
// [1518-11-04 00:46] wakes up
// [1518-11-05 00:03] Guard #99 begins shift
// [1518-11-05 00:45] falls asleep
// [1518-11-05 00:55] wakes up`.split("\n");

function parse(line) {
  if (line.includes("Guard")) {
    return {
      event: "start",
      guard: line.match(/#(\d+)/)[1]
    };
  }
  const time = +line.match(/:(\d+)]/)[1];
  const date = line.match(/(\d+-\d+) /)[1];
  if (line.includes("falls asleep")) {
    return {
      event: "sleep",
      time,
      date
    };
  }
  if (line.includes("wakes up")) {
    return {
      event: "wakeup",
      time,
      date
    };
  }
}

function processLines(parsedLines) {
  const guardSleepMinutes = {};
  let sleeping;
  let currentGuard;

  function setSleepingMinute(minute, guard) {
    if (!guardSleepMinutes[guard][minute]) {
      guardSleepMinutes[guard][minute] = 0;
    }
    guardSleepMinutes[guard][minute]++;
  }

  function setSleeping(start, end, guard) {
    if (!guardSleepMinutes[guard]) {
      guardSleepMinutes[guard] = {
        total: 0
      };
    }
    for (let i = start; i < end; i++) {
      setSleepingMinute(i, guard);
    }
    guardSleepMinutes[guard].total += end - start;
  }

  function setSleepingTillEnd(sleeping) {
    if (sleeping) {
      setSleeping(sleeping, 60, currentGuard);
    }
  }

  parsedLines.forEach(parsed => {
    const { event, time, date, guard } = parsed;
    if (event === "start") {
      setSleepingTillEnd();
      sleeping = false;
      currentGuard = guard;
    }
    if (event === "sleep") {
      sleeping = time;
    }
    if (event === "wakeup") {
      setSleeping(sleeping, time, currentGuard);
      sleeping = false;
    }
  });
  setSleepingTillEnd();
  return guardSleepMinutes;
}

function maxGuardAndMinute(guardSleepMinutes) {
  let maxGuard;
  let maxSlept = 0;
  Object.keys(guardSleepMinutes).forEach(key => {
    const slept = guardSleepMinutes[key].total;
    if (slept > maxSlept) {
      maxSlept = slept;
      maxGuard = key;
    }
  });

  let maxSleptMinute;
  let maxSleptPerMinute = 0;
  Object.keys(guardSleepMinutes[maxGuard]).forEach(minute => {
    if (minute !== "total") {
      let sleptPerMinute = guardSleepMinutes[maxGuard][minute];
      if (sleptPerMinute > maxSleptPerMinute) {
        maxSleptMinute = minute;
        maxSleptPerMinute = sleptPerMinute;
      }
    }
  });

  return [maxGuard, maxSleptMinute, maxGuard * maxSleptMinute];
}

function maxGuardAndMinute2(guardSleepMinutes) {
  let maxGuard;
  let maxSleptMinute;
  let maxSleptPerMinute = 0;
  Object.keys(guardSleepMinutes).forEach(key => {
    Object.keys(guardSleepMinutes[key]).forEach(minute => {
      if (minute !== "total") {
        let sleptPerMinute = guardSleepMinutes[key][minute];
        if (sleptPerMinute > maxSleptPerMinute) {
          maxSleptMinute = minute;
          maxSleptPerMinute = sleptPerMinute;
          maxGuard = key;
        }
      }
    });
  });

  return [maxGuard, maxSleptMinute, maxSleptPerMinute, maxGuard * maxSleptMinute];
}
// part 1
console.log(maxGuardAndMinute(processLines(input.map(parse))));

// part 2
console.log(maxGuardAndMinute2(processLines(input.map(parse))));
