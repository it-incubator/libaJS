//@ts-ignore
import { propsTheSame } from './utils/propsTheSame'
import { ensureChildren } from './utils/ensureChildren'
import { createChildren } from './utils/createChildren'
import { useState } from "./utils/useState"
import {renderComponent} from "./utils/renderComponent"
import {refresh} from "./utils/refresh"
import {CacheManager} from "./utils/children-cache-manager.ts";
import {createHtmlElement} from "./utils/createHtmlElement.ts";
import { useStateGuard } from './utils/useStateGuard.ts'
import { useEffectGuard } from './utils/useEffectGuard.ts'


type TLiba = {
    create<P extends {}, LS extends {}>(
        ComponentFunction: TComponentFunction<P, LS>,
        props?: Partial<P>,
        params?: TCreateMethodParams
    ): TComponentInstance<P, LS>;
    append(rootAlement: any, component: any): any
}

export type TComponentFunction<P extends {}, LS extends {}> = {
    (props:Partial<P>, ParamsObject: { liba: TRenderLiba }): TComponentInstance<Partial<P>, LS>;
}

export type TComponentInstance<P extends {}, LS extends {}> = {
    props?: Partial<P>;
    element: any;
    status: 'created' | 'first-rendering' | 'other';
    localState?: LS;
    type?: TComponentFunction<P, LS>;
    refresh?: () => void;
    childrenIndex?: number;
    useStateCallIndex?: number;
    useEffectCallIndex?: number;
    childrenComponents?: CacheManager<any>;
    renderLiba: TRenderLiba;
    cleanup?: () => void
    cleanups: (() => void)[]
}

type TComponentRenderFunctionArgs<P extends {}, LS extends {}> = {
    props?: Partial<P>;
    localState?: LS;
    statesWithSetters: Array<[TStateWrapperWithSetter<any>[0]["value"], TDispatch<any>]>;
    liba: TRenderLiba;
}

type TRefresh = () => void;

type TCreateMethodParams = {
    parent?: TComponentInstance<any, any> | null;
}

type TRenderLiba = {
    create<P extends {}, EL extends HTMLElement, LS extends {}>(
        ComponentFunction: TComponentFunction<P, LS>,
        props?: Partial<P>
    ): TComponentInstance<P, LS>;
    refresh: TRefresh,
    useState: any,
    useEffect: (effect: () =>  (() => {}) | void, deps: any[]) => void,
    createRoot_: any
}

type TSetStateAction<T> = T | ((prevState: T) => T);
export type TDispatch<T> = (action: TSetStateAction<T>) => void;
type TComponentLiba = {
    useState: <T>(initialState: T) => [T, TDispatch<T>];
    create: (tagName: keyof HTMLElementTagNameMap, props?: any) => HTMLElement;
}
export type TStateWrapperWithSetter<T> = [ T, TDispatch<T>];



export const Liba: TLiba = {
    create(ComponentFunction, props = {}, { parent, key } = { parent: null, key: null }) {

        let effectsDepsWrapper = [];
        let stateWrappersWithSetters: Array<TStateWrapperWithSetter<any>> = [];

        let rootComponentElement = null;

        let useStateCallCountOnFirstRender = 0;
        let useEffectCallCountOnFirstRender = 0;

        const componentInstance: TComponentInstance<any, any> = {} as TComponentInstance<any, any>

       // ComponentFunction(props, { liba: componentLiba })
        // if (rootComponentElement === null) {
        //     // todo: create LibaError extends Error
        //     throw new Error('You must call liba.create in your component function for creating root element: ' + ComponentFunction.name)
        // }

        componentInstance.status = 'created'
        componentInstance.cleanups = []

        componentInstance.element = null

        componentInstance.props = props as any
        componentInstance.type = ComponentFunction as any

        componentInstance.renderLiba = {
            create(
                ChildrenComponentFunction, props = {}, {key, append} = {key:null}
            ) {
                //if (componentInstance.childrenIndex === -1 && componentInstance.element !== null) {
               //     componentInstance.childrenIndex++
                //    return;
                //}

                // if (componentInstance.childrenIndex === -1 && componentInstance.element === null) {
                //     componentInstance.element = createHtmlElement(ChildrenComponentFunction as keyof HTMLElementTagNameMap, props) as any
                //     componentInstance.childrenIndex++
                //     return componentInstance.element
                // }

                // нам прилетает в параметре либо функциональный компонент либо html элемент в виде названия строки, например 'div'
                if (typeof ChildrenComponentFunction === 'function') {
                    const newComponent = createChildren(componentInstance, ChildrenComponentFunction as TComponentFunction<any, any>, props, key)
                    componentInstance.element.append(newComponent.element)
                    return newComponent
                } else {
                    componentInstance.childrenIndex++
                    const newElement = createHtmlElement(ChildrenComponentFunction, props) as any
                    // todo: think how make it better
                    // if (append !== false) {
                    //     componentInstance.element.append(newElement)
                    // }
                    return newElement
                }
            },
            refresh() {
                refresh(componentInstance, stateWrappersWithSetters)
            },
            useState: <T>(initialState: T): [T, TDispatch<T>] => {
                componentInstance.useStateCallIndex++;

                if (useStateGuard(componentInstance, useStateCallCountOnFirstRender)) {
                  throw new Error('Между рендерами разное количество useState!');
                }

                if (componentInstance.status === 'first-rendering') {
                    useStateCallCountOnFirstRender++;
                    const refreshComponent = () => componentInstance.renderLiba.refresh()
                    return useState<T>(initialState, stateWrappersWithSetters, refreshComponent)
                } else {
                    const stateWrappersWithSetter = stateWrappersWithSetters[componentInstance.useStateCallIndex]
                    return ([
                        stateWrappersWithSetter[0].value as any,
                        stateWrappersWithSetter[1]
                    ])
                }
            },

            useEffect(effect: any, deps = []) {
                componentInstance.useEffectCallIndex++;

                if (useEffectGuard(componentInstance, useEffectCallCountOnFirstRender)) {
                  throw new Error('Между рендерами разное количество useEffect!');
                }

                if (componentInstance.status === 'first-rendering') {
                    useEffectCallCountOnFirstRender++;

                    const cleanup = effect()
                    effectsDepsWrapper.push(deps);
                    console.log('Effect called')
                    if (cleanup) {
                        componentInstance.cleanups.push(cleanup)
                    } else {
                        componentInstance.cleanups.push(() => {});
                    }
                } else {
                  const effectDeps = effectsDepsWrapper[componentInstance.useEffectCallIndex];
                  
                  if (effectDeps.length !== deps.length) {
                    throw new Error('Нельзя менять список зависимостей!');
                  }

                  effectDeps.forEach((el, i) => {
                    if (el !== deps[i]) {
                      componentInstance.cleanups[componentInstance.useEffectCallIndex]();
                      const cleanup = effect() || (() => {});

                      effectsDepsWrapper[componentInstance.useEffectCallIndex] = deps;
                      componentInstance.cleanups[componentInstance.useEffectCallIndex] = cleanup;
                    }
                  });
                    // analyze dependencies
                }
            },

            createRoot_(elementName, props = {}) {
                if (componentInstance.element !== null) return;
                componentInstance.element = createHtmlElement(elementName, props) as any
                return rootComponentElement
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
    append(parentElement, component) {
        parentElement.append(component.element)
        component.parentElement = parentElement
    }
}