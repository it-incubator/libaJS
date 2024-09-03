//@ts-ignore
import { propsTheSame } from './utils/propsTheSame.ts'
import { ensureChildren } from './utils/ensureChildren.ts'
import { createChildren } from './utils/createChildren.ts'
import { useState } from "./utils/useState.ts"
import {renderComponent} from "./utils/renderComponent.ts"
import {refresh} from "./utils/refresh.ts"


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
    childrenComponents?: TComponentInstance<any, any, any>[];
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
}
export type TStateWrapperWithSetter<T> = [ T, TDispatch<T>];



export const Liba: TLiba = {
    create(ComponentFunction, props = {}, { parent } = { parent: null }) {

        let stateWrappersWithSetters: Array<TStateWrapperWithSetter<any>> = [];

        //Либа которую передаем в саму функцию-компонент
        const componentLiba: TComponentLiba = {
            useState: <T>(initialState: T): [T, TDispatch<T>] => {
                const refreshComponent = () => componentInstance.renderLiba.refresh()
                return useState<T>(initialState, stateWrappersWithSetters, refreshComponent)
            }
        }

        const componentInstance = ComponentFunction(props, { liba: componentLiba })

        componentInstance.type = ComponentFunction

        componentInstance.renderLiba = {
            create: (
                ChildrenComponentFunction, props = {}
            ) => createChildren(componentInstance, ChildrenComponentFunction as TComponentFunction<any, any, any>, props),
            refresh: () => refresh(componentInstance, stateWrappersWithSetters)
        }

        //Проверяем есть ли parent, если он есть пушим наш инстанс в массив childrenComponents
        if (parent) {
            ensureChildren(parent)
            parent.childrenComponents![parent.childrenIndex!] = componentInstance
        }

        renderComponent(componentInstance, stateWrappersWithSetters)

        return componentInstance
    },
    refresh() {

    }
}