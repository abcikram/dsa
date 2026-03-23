function palindrom(i: number, n: number, s: string) {
  // console.log("ddddd", i, n ,s)

  if (i >= n / 2) return true;
  if (s[i] != s[n - i - 1]) return false;

  return palindrom(i + 1, n, s);
}

function main(s: string) {
  let n = s.length;
  let i = 0;

  return palindrom(i, n, s);
}

console.log(main("madam"));
