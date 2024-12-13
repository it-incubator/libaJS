import {FiberNode} from "./utils/create-fiber-node.ts";
import {createVirtualNode} from "./utils/create-virtual-node.ts";
import {useState} from "./utils/use-state.ts";
import {reconsilation} from "./utils/reconsilation.ts";


// @ts-ignore
window.rootFiber = null;
// @ts-ignore
window.rootVirtualNode = null;

export const Liba: any = {
    onFiberTreeChanged: () => {},
    create(ComponentFunctionOrTagName, props: any = {}) {
        const fiberNode = new FiberNode(ComponentFunctionOrTagName, props)
        fiberNode.virtualNode = createVirtualNode(fiberNode);
        // @ts-ignore
        if (window.rootFiber === null) {
            // @ts-ignore
            window.rootFiber = fiberNode;
            // @ts-ignore
            window.rootVirtualNode = fiberNode.virtualNode;
        }


        // если у текущего компонента есть дети (уже созданные ранее файберы)
        // нужно из запушить в родительский файбер
        if (props.children?.length) {
            props.children.forEach((childFiber: any) => {
                fiberNode.children.push(childFiber);
            })
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
                            const newFiberVersion = ComponentFunctionOrTagName(fiberNode.props, {
                                liba: renderLiba
                            })
                            fiberNode.rendersCount++;

                            const patchTree = reconsilation(fiberNode.children[0], newFiberVersion)

                        //    fiberNode.children[0].element.remove();
                         //   fiberNode.children[0] = newFiberVersion;
                            Liba.onFiberTreeChanged(fiberNode.children[0], newFiberVersion, patchTree)
                            fiberNode.children[0] = newFiberVersion;
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
            //rootChildFiber.virtualNode = createVirtualNode(fiberNode);

            fiberNode.rendersCount++;
            fiberNode.children.push(rootChildFiber)
           // fiberNode.virtualNode.children.push(rootChildFiber.virtualNode)

            //const virtualNode = createVirtualNode(ComponentFunction, props)
          //  fiberNode.virtualNode = createVirtualNode(fiberNode);
        } else {
            //
        }

        return fiberNode;
    }
}


