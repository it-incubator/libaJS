import { createHtmlElement } from "./utils/createHtmlElement";

type Key = string | number | bigint;

interface Attributes {
  key?: Key | null | undefined;
}

type LibaNode = string
  | number
  | boolean
  | null
  | undefined

interface FunctionComponent<P = {}> {
  props: P,
}

type LibaElement = any;

type CreateElement<P extends {}> = (
  type: FunctionComponent<P> | string,
  props?: Attributes & P | null,
  ...children: LibaNode[]
) => LibaElement;

type LibaRoot = {
  render: (app: LibaElement) => void,
};

type CreateRoot = (element: HTMLElement) => LibaRoot;

interface ILiba {
  createElement: CreateElement<{}>;
  createRoot: CreateRoot;
}

export const Liba: ILiba = {
  createElement: (type, props, children) => {
    const rootComponentElement = document.createElement('div');
    const renderLiba = Liba;

    if (typeof type === 'string') {
      const newElement = createHtmlElement(type, props) as any;
      rootComponentElement.append(newElement);
    }
    
    if (typeof type === 'function') {
      const newElement = type(props, { liba: renderLiba });
      rootComponentElement.append(newElement);
    }

    return rootComponentElement;
  },
  createRoot: (element) => {
    return {
      render: (AppComponent) => {
        debugger;
        element.append(AppComponent({}, { liba: Liba }));
      }
    };
  },
}