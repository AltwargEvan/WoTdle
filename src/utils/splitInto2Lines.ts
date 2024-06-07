export function splitInto2Lines(text: string, indentBoundary: number) {
  if (text.length <= indentBoundary) return [text];
  let l = Math.floor(text.length / 2);
  let r = Math.ceil(text.length / 2);

  let i = text.length / 2;
  while (i > 0) {
    if (text.at(l) === " ") {
      return [text.slice(0, l), text.slice(l)];
    } else if (text.at(r) === " ") {
      return [text.slice(0, r), text.slice(r)];
    } else {
      r++;
      l--;
      i--;
    }
  }
  return [];
}
