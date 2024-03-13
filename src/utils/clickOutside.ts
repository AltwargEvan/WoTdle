import { Accessor, onCleanup } from "solid-js";

type Directive<P = true> = (el: Element, props: Accessor<P>) => void;

const clickOutside: Directive<VoidFunction> = (el, accessor) => {
  const onClick = (e: MouseEvent) =>
    e.target instanceof Element && !el.contains(e.target) && accessor()();

  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
};

export default clickOutside;

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      clickOutside: VoidFunction;
    }
  }
}
