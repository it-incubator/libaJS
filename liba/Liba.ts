//@ts-ignore
import { propsTheSame } from './utils/propsTheSame.js'
//@ts-ignore
import { ensureChildren } from './utils/ensureChildren.js'


type TLiba = {
    create<P extends {}>(ComponentFunction: TComponentFunction, props?: Partial<P>, params?: TCreateMethodParams): ReturnType<TComponentFunction>;
    refresh: TRefresh
}

type TComponentFunction  = {
    <P extends {}, LS extends {}>(props: P, ParamsObject: { liba: TComponentLiba },): TComponentInstance<P, LS>;
    render: <P extends {}, LS extends {}>(args: TComponentRenderFunctionArgs<P, LS>) => void;
}

type TComponentInstance<P extends {}, LS extends {}> = {
    props?: Partial<P>
    element: HTMLElement;
    localState?: LS
    type?: TComponentFunction;
    refresh?: () => void;
    childrenIndex?: number;
    childrenComponents?: TComponentInstance<any, any>[];
    
}

type TComponentRenderFunctionArgs<P extends {}, LS extends {}> = {
    element: HTMLElement;
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
    create<P extends {}>(ComponentFunction: TComponentFunction, props?: Partial<P>): ReturnType<TComponentFunction>;
    refresh: TRefresh
}

type TSetStateAction<T> = T | ((prevState: T) => T);
type TDispatch<T> = (action: TSetStateAction<T>) => void;
type TComponentLiba = {
    refresh: TRefresh;
    useState: <T>(initialState: T) => [T, TDispatch<T>]
}
type TStateWrapperWithSetter<T> = [{ value: T }, TDispatch<T>];



export const Liba: TLiba = {
    create(ComponentFunction, props = {}, { parent } = { parent: null }) {

        //Либа которую передаем в метод render
        const renderLiba: TRenderLiba = {
            create: (ChildrenComponentFunction, props = {}) => {
                componentInstance.childrenIndex!++

                const alreadyExistedComponentInstance = componentInstance.childrenComponents?.[componentInstance.childrenIndex!]

                if (alreadyExistedComponentInstance) {
                    if (alreadyExistedComponentInstance.type === ChildrenComponentFunction) {
                        if (propsTheSame(props, alreadyExistedComponentInstance.props)) {
                            return alreadyExistedComponentInstance
                        } else {
                            alreadyExistedComponentInstance.props = props
                            alreadyExistedComponentInstance.refresh?.()
                            return alreadyExistedComponentInstance
                        }
                    } else {
                        delete componentInstance.childrenComponents?.[componentInstance.childrenIndex!]
                    }
                }

                const childInstance = Liba.create(ChildrenComponentFunction, props, { parent: componentInstance })

                return childInstance;
            },
            refresh() {
                // todo: if element doesn't hav innerHTML??
                if ("innerHTML" in componentInstance.element) componentInstance.element.innerHTML = ''

                //componentInstance.childrenComponents = []
                renderComponent();
            }
        }

        let stateWrappers = []
        let stateWrappersWithSetters: Array<TStateWrapperWithSetter<any>> = [];

        //Либа которую передаем в саму функцию-компонент
        const componentLiba: TComponentLiba = {
            refresh: renderLiba.refresh,
            useState: <T>(initialState: T): [T, TDispatch<T>] => {
                const stateWrapper = { value: initialState }
                stateWrappers.push(stateWrapper)

                const setter: TDispatch<T> = (newValueOrReducer: TSetStateAction<T>) => {
                    if (typeof newValueOrReducer === 'function') {
                        stateWrapper.value = (newValueOrReducer as (prevState: T) => T)(stateWrapper.value);
                    } else {
                        stateWrapper.value = newValueOrReducer
                    }
                    renderLiba.refresh()
                };

                stateWrappersWithSetters.push([stateWrapper, setter])
                console.log(stateWrappers, "stateWrappers");
                
                return [stateWrapper.value, setter] as const
            }
        }

        const componentInstance = ComponentFunction(props, { liba: componentLiba })
        componentInstance.type = ComponentFunction
        componentInstance.refresh = renderLiba.refresh


        //Проверяем есть ли parent, если он есть пушим наш инстанс в массив childrenComponents
        if (parent) {
            ensureChildren(parent)
            parent.childrenComponents![parent.childrenIndex!] = componentInstance
        } 

        function renderComponent() {

            //При изначальном создании компонента устанавливаем childrenIndex и инкременитуем при создании дочернего компонента в renderLiba
            componentInstance.childrenIndex = -1;

            ComponentFunction.render({
                element: componentInstance.element,
                localState: componentInstance.localState,
                statesWithSetters: stateWrappersWithSetters.map(swws => [swws[0].value, swws[1]]),
                props: componentInstance.props,
                liba: renderLiba
            })
        }

        renderComponent()

        return componentInstance
    },
    refresh() {

    }
}