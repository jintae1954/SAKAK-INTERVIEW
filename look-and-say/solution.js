function makeNextLn(prevLn) {
  let cnt = 0;
  let nextLn = '';

  [...prevLn].reduce((acc, a, i) => {
    if (acc !== a && i > 0) {
      nextLn += cnt + acc;
      cnt = 0;
    }

    cnt += 1;
    acc = a;

    if (i === prevLn.length - 1) {
      nextLn += cnt + acc;
      cnt = 0;
    }

    return acc;
  }, '');

  return nextLn;
}

export function printMid(n) {
  if (n < 3 || n > 100) return -1;

  let Ln = '1';
  while (n > 1) {
    Ln = makeNextLn(Ln);
    n--;
  }
  const mid = Ln.length / 2;
  const res = Ln[mid - 1] + Ln[mid];

  return res;
}
