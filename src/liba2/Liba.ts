import {FiberNode, FiberNode} from "./utils/create-fiber-node.ts";
import {createVirtualNode} from "./utils/create-virtual-node.ts";
import {useState} from "./utils/use-state.ts";
import {renderFiberNode} from "./LibaDOM.ts";

export const Liba: any = {
    create(ComponentFunctionOrTagName, props: any = {}) {
        const fiberNode = new FiberNode(ComponentFunctionOrTagName, props)

        // если у текущего компонента есть дети (уже созданные ранее файберы
        // нужно из запушить в родительский файбер
        if (props.children?.length) {
            props.children.forEach((childFiber: any) => fiberNode.children.push(childFiber))
        }

        if (typeof ComponentFunctionOrTagName === 'function') {
            const renderLiba = {
                create(childComponentFunctionOrTag: any, props = {}) {
                    return Liba.create(childComponentFunctionOrTag, props, {parentFiber: fiberNode})
                },
                useState<T>(initialValue: T) {
                    if (fiberNode.rendersCount !== 0) {
                        return  [fiberNode.stateNode[0][0].value, fiberNode.stateNode[0][1]];
                    } else {
                        const [wrapper, setValue] = useState(initialValue, () => {
                            const newFiberVerion = ComponentFunctionOrTagName(fiberNode.props, {
                                liba: renderLiba
                            })
                            fiberNode.rendersCount++;

                            fiberNode.children[0].element.remove();
                            fiberNode.children[0] = newFiberVerion;
                            renderFiberNode(fiberNode,fiberNode.parentElement)
                        })

                        fiberNode.pushState([wrapper, setValue]);

                        return [wrapper.value, setValue]
                    }


                }
            }

            // каждый компоннет выполняясь, внутри себя обязан запустить
            // liba.create а значит вернёт один корневой файбер компонента.
            const rootChildFiber = ComponentFunctionOrTagName(props, {
                liba: renderLiba
            })
            fiberNode.rendersCount++;

            fiberNode.children.push(rootChildFiber)

            //const virtualNode = createVirtualNode(ComponentFunction, props)
            fiberNode.virtualNode = createVirtualNode(fiberNode);
        } else {
            fiberNode.virtualNode = createVirtualNode(fiberNode);
        }

        return fiberNode;
    }
}


