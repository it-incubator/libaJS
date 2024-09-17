//@ts-ignore
import { propsTheSame } from './utils/propsTheSame'
import { ensureChildren } from './utils/ensureChildren'
import { createChildren } from './utils/createChildren'
import { useState } from "./utils/useState"
import {renderComponent} from "./utils/renderComponent"
import {refresh} from "./utils/refresh"
import {CacheManager} from "./utils/children-cache-manager.ts";
import {createHtmlElement, HtmlElementProps} from "./utils/createHtmlElement.ts";


type TLiba = {
    create<P extends {}, EL extends HTMLElement, LS extends {}>(
        ComponentFunction: TComponentFunction<P, EL, LS>,
        props?: Partial<P>,
        params?: TCreateMethodParams
    ): TComponentInstance<P, EL, LS>;
    refresh: TRefresh;
}

export type TComponentFunction<P extends {}, EL extends HTMLElement, LS extends {}> = {
    (props:Partial<P>, ParamsObject: { liba: TComponentLiba }): TComponentInstance<Partial<P>, EL, LS>;
    render: (args: TComponentRenderFunctionArgs<P, EL, LS>) => void;
}

export type TComponentInstance<P extends {}, EL extends HTMLElement, LS extends {}> = {
    props?: Partial<P>;
    element: EL;
    localState?: LS;
    type?: TComponentFunction<P, EL, LS>;
    refresh?: () => void;
    childrenIndex?: number;
    childrenComponents?: CacheManager<any>;
    renderLiba: TRenderLiba;
    cleanup?: () => void
}

type TComponentRenderFunctionArgs<P extends {}, EL extends HTMLElement, LS extends {}> = {
    element: EL;
    props?: Partial<P>;
    localState?: LS;
    statesWithSetters: Array<[TStateWrapperWithSetter<any>[0]["value"], TDispatch<any>]>;
    liba: TRenderLiba;
}

type TRefresh = () => void;

type TCreateMethodParams = {
    parent?: TComponentInstance<any, any, any> | null;
}

type TRenderLiba = {
    create<P extends {}, EL extends HTMLElement, LS extends {}>(
        ComponentFunction: TComponentFunction<P, EL, LS>,
        props?: Partial<P>
    ): TComponentInstance<P, EL, LS>;
    refresh: TRefresh
}

type TSetStateAction<T> = T | ((prevState: T) => T);
export type TDispatch<T> = (action: TSetStateAction<T>) => void;
type TComponentLiba = {
    useState: <T>(initialState: T) => [T, TDispatch<T>];
    create: (tagName: keyof HTMLElementTagNameMap, props?: HtmlElementProps) => HTMLElement;
}
export type TStateWrapperWithSetter<T> = [ T, TDispatch<T>];



export const Liba: TLiba = {
    create(ComponentFunction, props = {}, { parent, key } = { parent: null, key: null }) {

        let stateWrappersWithSetters: Array<TStateWrapperWithSetter<any>> = [];

        let rootComponentElement = null;

        //Либа которую передаем в саму функцию-компонент
        const componentLiba: TComponentLiba = {
            useState: <T>(initialState: T): [T, TDispatch<T>] => {
                const refreshComponent = () => componentInstance.renderLiba.refresh()
                return useState<T>(initialState, stateWrappersWithSetters, refreshComponent)
            },
            create(elementName, props = {}) {
                rootComponentElement = createHtmlElement(elementName, props) as any
                return rootComponentElement
            }
        }

        const componentInstance = ComponentFunction(props, { liba: componentLiba })
        if (rootComponentElement === null) {
            // todo: create LibaError extends Error
            throw new Error('You must call liba.create in your component function for creating root element: ' + ComponentFunction.name)
        }

        componentInstance.element = rootComponentElement

        componentInstance.props = props as any
        componentInstance.type = ComponentFunction

        componentInstance.renderLiba = {
            create(
                ChildrenComponentFunction, props = {}, {key, append} = {key:null}
            ) {
                // нам прилетает в параметре либо функциональный компонент либо html элемент в виде названия строки, например 'div'
                if (typeof ChildrenComponentFunction === 'function') {
                    const newComponent = createChildren(componentInstance, ChildrenComponentFunction as TComponentFunction<any, any, any>, props, key)
                    rootComponentElement.append(newComponent.element)
                    return newComponent
                } else {
                    const newElement = createHtmlElement(ChildrenComponentFunction, props) as any
                    // todo: think how make it better
                    if (append !== false) {
                        rootComponentElement.append(newElement)
                    }
                    return newElement
                }
            },
            refresh() {
                refresh(componentInstance, stateWrappersWithSetters)
            }
        }

        //Проверяем есть ли parent, если он есть пушим наш инстанс в массив childrenComponents
        if (parent) {
            ensureChildren(parent)
            parent.childrenComponents.addItem(componentInstance, ComponentFunction, key)
        }

        renderComponent(componentInstance, stateWrappersWithSetters)

        return componentInstance
    },
    refresh() {

    }
}