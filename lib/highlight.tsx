import type { ReactNode } from "react";

const TOKEN =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)|\b(const|let|export|function|return|import|from|it|expect|describe|type|new)\b|\b(\d[\d_]*)\b|\b([a-zA-Z_]\w*)(?=\()/g;

/** Tiny TypeScript-ish highlighter for the illustrative code on the page. */
export function hl(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const cls = m[1] ? "tk-com" : m[2] ? "tk-str" : m[3] ? "tk-kw" : m[4] ? "tk-num" : "tk-fn";
    out.push(
      <span key={m.index} className={cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}
