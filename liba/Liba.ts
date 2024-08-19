import { propsTheSame } from './utils/propsTheSame.js'
import { ensureChildren } from './utils/ensureChildren.js'


type TLiba = {
    create<P extends {}>(ComponentFunction: TComponentFunction, props?: P, params?: TCreateMethodParams): ReturnType<TComponentFunction>;
    refresh: TRefresh
}

type TComponentFunction  = {
    <P extends {}, EL extends HTMLElement, LS extends {}>(props: P, liba: {},): TComponentInstance<P, EL, LS>;
    render: <P extends {}, EL extends HTMLElement, LS extends {}>(args: TComponentRenderFunctionArgs<P, EL, LS>) => void;
}

type TComponentInstance<P extends {}, EL extends HTMLElement, LS extends {}> = {
    props?: P
    element: EL;
    localState?: LS
    type?: TComponentFunction; //тут не совсем понятно
    refresh?: () => void;
    childrenIndex?: number;
    childrenComponents?: any[];
    
}

type TComponentRenderFunctionArgs<P extends {}, EL extends HTMLElement, LS extends {}> = {
    element: EL;
    props?: P;
    localState?: LS;
    statesWithSetters: any[]; //Тут как-то нужно сделать чтобы типы пробрасывались с дженерика TComponentLiba 47сипрка
    liba: {};
}

type TRefresh = () => void;

type TCreateMethodParams = {
    parent?: any;
}

type TRenderLiba = {
    create<P extends {}>(ComponentFunction: TComponentFunction, props?: P): ReturnType<TComponentFunction>;
    refresh: TRefresh
}


//---этот кусок сделал с помощью chatGpt
type TSetStateAction<T> = T | ((prevState: T) => T);
type TDispatch<T> = (action: TSetStateAction<T>) => void;
type TComponentLiba = {
    refresh: TRefresh;
    useState: <T>(initialState: T) => [T, TDispatch<T>]
}
//---



export const Liba: TLiba = {
    create(ComponentFunction, props = {}, { parent } = { parent: null }) {

        //Либа которую передаем в метод render
        const renderLiba: TRenderLiba = {
            create: (ChildrenComponentFunction, props = {}) => {
                componentInstance.childrenIndex++

                const alreadyExistedComponentInstance = componentInstance.childrenComponents?.[componentInstance.childrenIndex]

                if (alreadyExistedComponentInstance) {
                    if (alreadyExistedComponentInstance.type === ChildrenComponentFunction) {
                        if (propsTheSame(props, alreadyExistedComponentInstance.props)) {
                            return alreadyExistedComponentInstance
                        } else {
                            alreadyExistedComponentInstance.props = props
                            alreadyExistedComponentInstance.refresh()
                            return alreadyExistedComponentInstance
                        }
                    } else {
                        delete componentInstance.childrenComponents[componentInstance.childrenIndex]
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
        let stateWrappersWithSetters = [] //[[]];

        //Либа которую передаем в саму функцию-компонент
        const componentLiba: TComponentLiba = {
            refresh: renderLiba.refresh,
            useState: (initialState) => {
                const stateWrapper = { value: initialState }
                stateWrappers.push(stateWrapper)
                const setter = (newValueOrReducer) => {
                    if (typeof newValueOrReducer === 'function') {
                        stateWrapper.value = newValueOrReducer(stateWrapper.value)
                    } else {
                        stateWrapper.value = newValueOrReducer
                    }
                    renderLiba.refresh()
                };

                stateWrappersWithSetters.push([stateWrapper, setter])
                console.log(stateWrappers, "stateWrappers");
                
                return [stateWrapper.value, setter] as const//было stateWrappers.value возможно ошибка
            }
        }

        const componentInstance = ComponentFunction(props, { liba: componentLiba })
        componentInstance.type = ComponentFunction
        componentInstance.refresh = renderLiba.refresh


        //Проверяем есть ли parent, если он есть пушим наш инстанс в массив childrenComponents
        if (parent) {
            ensureChildren(parent)
            parent.childrenComponents[parent.childrenIndex] = componentInstance
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