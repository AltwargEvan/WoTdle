import { createMemo, createSignal } from "solid-js";
import { en_dict } from "./en";
import * as i18n from "@solid-primitives/i18n";

export type RawDictionary = typeof en_dict;
export type Dictionary = i18n.Flatten<RawDictionary>;

const dictionaries = {
  en: en_dict,
};

type Locale = keyof typeof dictionaries;

const [locale, setLocale] = createSignal<Locale>("en");

const dict = createMemo(() => i18n.flatten(dictionaries[locale()]));

export const t = i18n.translator(dict);
