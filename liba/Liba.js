function ensureStateAndChild(component) {
    if (!component.localState) component.localState = {};
    if (!component.localState.childComponents) component.localState.childComponents = [];

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
    create(componentFunction, props = {}, inner = {parent: null}) {
        const libaForComponent = {
            refresh() {
                render();
            }
        }

        const libaForRender = {
            create: (childComponentFunction, props = {}) => {

                component.childIndex++


                const existedChildComponent = component.localState.childComponents[component.childIndex]
                if (existedChildComponent
                    && propsTheSame(existedChildComponent.props, props)
                ){
                     return existedChildComponent;
                }

                const childComponent = Liba.create(childComponentFunction, props, {parent: component})

                ensureStateAndChild(component)
                component.localState.childComponents[component.childIndex] = childComponent;

                return childComponent
            },
            refresh() {
                render();
            }
        }

        const component = componentFunction(props, {liba: libaForComponent})

        parent.children?.push(component);

        function render() {
            component.element.innerHTML = ''

            ensureStateAndChild(component)

            component.localState.childComponents.forEach(cc => cc.cleanup())

            component.childIndex = -1

            componentFunction.render({
                element: component.element,
                localState: component.localState,
                props,
                liba: libaForRender
            })
        }

        render()

        return component
    }
}