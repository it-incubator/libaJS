import {FiberNode} from "./utils/create-fiber-node.ts";
import {useState} from "./utils/use-state.ts";
import {reconsilation} from "./utils/reconsilation.ts";


// @ts-ignore
window.rootFiber = null;
// @ts-ignore
window.rootVirtualNode = null;

function collectNodesWithFunctionType(node, result) {
    if (typeof node.type === 'function') {
        result.push(node);
    }
    
    if (node.child) {
        collectNodesWithFunctionType(node.child, result);
    }
    
    if (node.sibling) {
        collectNodesWithFunctionType(node.sibling, result);
    }
}

export const Liba: any = {
    onFiberTreeChanged: () => {},
    create(ComponentFunctionOrTagName, props: any = {}, defaultFiberNodeFields: any) {
        const fiberNode = new FiberNode(ComponentFunctionOrTagName, props, defaultFiberNodeFields);

        let childrenFiberNodeComponents = [];

        // @ts-ignore
        if (window.rootFiber === null) {
            // @ts-ignore
            window.rootFiber = fiberNode;
            // @ts-ignore
            window.rootVirtualNode = fiberNode.virtualNode;
        }


        // если у текущего компонента есть дети (уже созданные ранее файберы)
        // нужно запушить в родительский файбер первого ребёнка, и сделать перелинковку братьям
        if (props.children?.length) {
            props.children.forEach((childFiber: any, i: number) => {
                if (i === 0) {
                    fiberNode.child = childFiber;
                } else {
                    // if (typeof childFiber === 'object') { // fix it when error occur
                    //     childFiber.parent = fiberNode;
                    // }
                    props.children[i-1].sibling = childFiber
                }
                if (typeof childFiber === 'object') {
                    childFiber.parent = fiberNode;
                }
            })
        }

        if (typeof ComponentFunctionOrTagName === 'function') {
            const renderLiba = {
                create(childComponentFunctionOrTag: any, props = {}) {
                    return Liba.create(childComponentFunctionOrTag, props)
                },
                useState<T>(initialValue: T) {
                    if (fiberNode.rendersCount === 0) {
                        const [wrapper, setValue] = useState(initialValue, () => {
                            const newFiberVersion = ComponentFunctionOrTagName(fiberNode.props, {
                                liba: {
                                    ...renderLiba,
                                    create: renderLiba.update,
                                },
                            })
                            collectNodesWithFunctionType(newFiberVersion, childrenFiberNodeComponents);
                            fiberNode.rendersCount++;
                            fiberNode.resetStateIndex(); // why we reset stateIndex?

                            const patchTree = reconsilation(fiberNode.child, newFiberVersion, fiberNode.type)

                            //    fiberNode.children[0].element.remove();
                            //   fiberNode.children[0] = newFiberVersion;
                            Liba.onFiberTreeChanged(fiberNode.child, newFiberVersion, patchTree)
                            fiberNode.child = newFiberVersion;
                        })

                        fiberNode.pushState([wrapper, setValue]);

                        return [wrapper.value, setValue]
                    } else {
                        return fiberNode.getState();
                    }
                },
                update(childComponentFunctionOrTag: any, props = {}) {
                    if (
                        childComponentFunctionOrTag
                        && typeof childComponentFunctionOrTag === 'function'
                        && fiberNode.type !== childComponentFunctionOrTag?.type
                        && childrenFiberNodeComponents.length
                    ) {
                        const result = Liba.create(childComponentFunctionOrTag, props, {
                            stateNode: childrenFiberNodeComponents.at(0).stateNode,
                            rendersCount: childrenFiberNodeComponents.at(0).rendersCount,
                        });
                        childrenFiberNodeComponents.shift();

                        return result;
                    }

                    return Liba.create(childComponentFunctionOrTag, props)
                },
            }

            // каждый компоннет выполняясь, внутри себя обязан запустить
            // liba.create а значит вернёт один корневой файбер компонента.
            const rootChildFiber = ComponentFunctionOrTagName(props, {
                liba: renderLiba
            });
            
            collectNodesWithFunctionType(rootChildFiber, childrenFiberNodeComponents);

            //rootChildFiber.virtualNode = createVirtualNode(fiberNode);

            fiberNode.rendersCount++;
            fiberNode.child = rootChildFiber;
           // fiberNode.virtualNode.children.push(rootChildFiber.virtualNode)

            //const virtualNode = createVirtualNode(ComponentFunction, props)
          //  fiberNode.virtualNode = createVirtualNode(fiberNode);
        } else {
            //
        }

        return fiberNode;
    }
}


