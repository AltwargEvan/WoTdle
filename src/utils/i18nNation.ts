import * as m from "@/paraglide/messages.js";

export const translateNation = (nation: string) => {
  const key = `nation_${nation}`;
  // @ts-expect-error trust me bro
  if (key in m) return m[key]() as string;
  else return nation;
};
