class Tree {
    constructor() {
        this.root = null
    }
    addNode(parentNode, component) {
        if (!parentNode && !this.root) {
            this.root = { component, children: []  }
            return;
        }
        parentNode.children.push({ component, children: []  })
    }

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
                return Liba.create(childComponentFunction, props, {parent: componentFunction})
            },
            refresh() {
                render();
            }
        }

        const component = componentFunction(props, {liba: libaForComponent})

        parent.children?.push(component);

        function render() {
            component.element.innerHTML = ''

            componentFunction.render({
                element: component.element,
                localState: component.localState,
                props,
                liba: libaForRender
            })
        }

        render()

        return component
    },
    tree: new Tree()
}

const fiber = {

}

