function ensureChildren(parent) {
    if (parent) {
        if (!parent.childrenComponents) parent.childrenComponents = []
    }
}

function propsTheSame(prevProps, newProps) {
    if (prevProps === newProps) return true;

    if ((prevProps == null && newProps != null) || (prevProps != null && newProps == null)) {
        return false;
    }

    const prevKeys = Object.keys(prevProps || {});
    const newKeys = Object.keys(newProps || {});

    if (prevKeys.length !== newKeys.length) {
        return false;
    }

    for (let key of prevKeys) {
        if (prevProps[key] !== newProps[key]) {
            return false;
        }
    }

    return true;
}


export const Liba = {
    create(ComponentFunction, props = {}, {parent} = {parent: null}) {
        const renderLiba = {
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

                const childInstance =  Liba.create(ChildrenComponentFunction, props, {parent: componentInstance})

                return childInstance;
            },
            refresh() {
                // todo: if element doesn't hav innerHTML??
                componentInstance.element.innerHTML = ''

                componentInstance.childrenComponents?.forEach(cc => cc.cleanup?.())
                //componentInstance.childrenComponents = []

                renderComponent();
            }
        }

        let stateWrappers = []
        let stateWrappersWithSetters = [] //[[]];

        const componentLiba = {
            refresh: renderLiba.refresh,
            useState: (initialState) => {
                const stateWrapper = { value: initialState}
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
                return [stateWrappers.value, setter]
            }
        }

        const componentInstance = ComponentFunction(props, {liba: componentLiba})

        componentInstance.type = ComponentFunction

        componentInstance.refresh = renderLiba.refresh


        if (parent) {
            ensureChildren(parent)
            parent.childrenComponents[parent.childrenIndex] = componentInstance
        }

        function renderComponent() {

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