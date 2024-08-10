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

        let stateWrappers = []
        let stateWrappersWithSetters = [] //[[]];

        const componentLiba = {
            useState: (initialState) => {
                const refreshComponent = () => componentInstance.renderLiba.refresh()
                return useState(initialState, stateWrappers, stateWrappersWithSetters, refreshComponent)
            }
        }

        const componentInstance = ComponentFunction(props, {liba: componentLiba})

        componentInstance.type = ComponentFunction

        componentInstance.renderLiba = {
            create: (
                ChildrenComponentFunction, props = {}
            ) => createChildren(componentInstance, ChildrenComponentFunction, props),
            refresh: () => refresh(componentInstance, stateWrappersWithSetters)
        }

        if (parent) {
            ensureChildren(parent)
            parent.childrenComponents[parent.childrenIndex] = componentInstance
        }

        renderComponent(componentInstance, stateWrappersWithSetters)

        return componentInstance
    },
    refresh() {

    }
}

function useState(initialState, stateWrappers, stateWrappersWithSetters, refreshComponent) {
    const stateWrapper = { value: initialState }
    stateWrappers.push(stateWrapper)
    const setter = (newValueOrReducer) => {
        if (typeof newValueOrReducer === 'function') {
            stateWrapper.value = newValueOrReducer(stateWrapper.value)
        } else {
            stateWrapper.value = newValueOrReducer
        }
        refreshComponent()
    };

    stateWrappersWithSetters.push([stateWrapper, setter])
    return [stateWrappers.value, setter]
}

function createChildren(componentInstance, ChildrenComponentFunction, props = {}) {
    componentInstance.childrenIndex++

    const alreadyExistedComponentInstance = componentInstance.childrenComponents?.[componentInstance.childrenIndex]

    if (alreadyExistedComponentInstance) {
        if (alreadyExistedComponentInstance.type === ChildrenComponentFunction) {
            if (propsTheSame(props, alreadyExistedComponentInstance.props)) {
                return alreadyExistedComponentInstance
            } else {
                alreadyExistedComponentInstance.props = props
                alreadyExistedComponentInstance.renderLiba.refresh()
                return alreadyExistedComponentInstance
            }
        } else {
            delete componentInstance.childrenComponents[componentInstance.childrenIndex]
        }
    }

    return Liba.create(ChildrenComponentFunction, props, {parent: componentInstance})
}

function renderComponent(componentInstance, stateWrappersWithSetters) {
    componentInstance.childrenIndex = -1;

    componentInstance.type.render({
        element: componentInstance.element,
        localState: componentInstance.localState,
        statesWithSetters: stateWrappersWithSetters.map(swws => [swws[0].value, swws[1]]),
        props: componentInstance.props,
        liba: componentInstance.renderLiba
    })
}

function refresh(componentInstance, stateWrappersWithSetters) {
    // todo: if element doesn't hav innerHTML??
    componentInstance.element.innerHTML = ''

    componentInstance.childrenComponents?.forEach(cc => cc.cleanup?.())
    //componentInstance.childrenComponents = []

    renderComponent(componentInstance, stateWrappersWithSetters);
}