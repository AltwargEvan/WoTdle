import { Component, JSX } from "solid-js";
import * as paraglide from "@/paraglide/runtime.js"; // generated by paraglide
import * as adapter from "./adapter";

export type AvailableLanguageTag = paraglide.AvailableLanguageTag;
export const { availableLanguageTags, sourceLanguageTag } = paraglide;
export const { useLocationPathname } = adapter;

export const { LanguageTagProvider, languageTag, setLanguageTag } =
  adapter.createI18n(paraglide);

/**
 * Programmatically change the language tag.
 * (won't work without javascript)
 */
export const LocaleSwitcher: Component = () => {
  const language_tag = languageTag();

  return (
    <select
      name="language"
      onChange={(e) => setLanguageTag(e.target.value as AvailableLanguageTag)}
    >
      {availableLanguageTags.map((tag) => (
        <option value={tag} selected={tag === language_tag}>
          {tag}
        </option>
      ))}
    </select>
  );
};

export interface AlternateLinksProps {
  href?: string;
  languageTag?: AvailableLanguageTag;
}

/**
 * Generates `<link rel="alternate" hreflang="..." href="...">` tags for all available languages.
 *
 * To be used in the `<head>` of your html document.
 */
export const AlternateLinks: Component<AlternateLinksProps> = (props) => {
  const language_tag = props.languageTag ?? languageTag();
  const href = props.href ?? useLocationPathname();
  const links: JSX.Element[] = [];

  for (const tag of availableLanguageTags) {
    if (tag !== language_tag) {
      links.push(
        <link
          rel="alternate"
          hreflang={tag}
          href={adapter.translateHref(
            href,
            tag,
            paraglide.availableLanguageTags
          )}
        />
      );
    }
  }

  return links;
};

/**
 * Get the language tag from the URL.
 *
 * @param pathname The pathname to check. (e.g. "/en/foo")
 * @returns The language tag from the URL, or `undefined` if no language tag was found.
 */
export function languageTagFromPathname(
  pathname: string
): AvailableLanguageTag | undefined {
  return adapter.languageTagFromPathname(pathname, availableLanguageTags);
}

/**
 * Get the language tag from the URL.
 */
export function useLocationLanguageTag(): AvailableLanguageTag | undefined {
  const pathname = useLocationPathname();
  return languageTagFromPathname(pathname);
}
