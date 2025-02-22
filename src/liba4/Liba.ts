import { FiberNode } from "./utils/create-fiber-node.ts";
import { useState } from "./utils/use-state.ts";
import { reconsilation } from "./utils/reconsilation.ts";

// @ts-ignore
window.rootFiber = null;
// @ts-ignore
window.rootVirtualNode = null;

function copyStateFromExistingFiberToNew(changedFiber: FiberNode | null, targetFiber: FiberNode) {
    let current = changedFiber;

    while (current) {
        if (!current.alreadyCopiedToNewFiberVersion && current.type === targetFiber.type && current.props.key === targetFiber.props.key) {
            current.copyStateToOtherFiber(targetFiber);
            current.alreadyCopiedToNewFiberVersion = true;
            return true;
        }

        if (current.child) {
            const result = copyStateFromExistingFiberToNew(current.child, targetFiber);
            if (result) return true;
        }

        current = current.sibling;
    }
}


export const Liba: any = {
    onFiberTreeChanged: () => {},
    currentFiber: null,
    /**
     * файбер в котором изменился стейт и который вызвал каскад рендеров
     */
    changedFiber: null,
    create(ComponentFunctionOrTagName, props: any = {}) {
        const fiberNode = new FiberNode(ComponentFunctionOrTagName, props);
        this.currentFiber = fiberNode;

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

            // перед тем как отрисовывать, нужно поискать уже существующий файбер чтобы скопировать его стейт.
            // если то не первая отрисовка, а из-за изменёноо стейта
            if (this.changedFiber) {
                    copyStateFromExistingFiberToNew(this.changedFiber, fiberNode);
            }

            // каждый компоннет выполняясь, внутри себя обязан запустить
            // liba.create а значит вернёт один корневой файбер компонента.
            const rootChildFiber = ComponentFunctionOrTagName(props)

            //rootChildFiber.virtualNode = createVirtualNode(fiberNode);

            fiberNode.rendersCount++;
            fiberNode.child = rootChildFiber;
            if (rootChildFiber) rootChildFiber.parent = fiberNode;
           // fiberNode.virtualNode.children.push(rootChildFiber.virtualNode)

            //const virtualNode = createVirtualNode(ComponentFunction, props)
          //  fiberNode.virtualNode = createVirtualNode(fiberNode);
        } else {
            //
        }

        return fiberNode;
    },
    useState<T>(initialValue: T) {
        const fiberNode = this.currentFiber;

        if (fiberNode.rendersCount === 0) {
            const [wrapper, setValue] = useState(initialValue, () => {
                this.currentFiber = fiberNode;
                this.changedFiber = fiberNode;
                const newFiberVersion = fiberNode.type(fiberNode.props);
                fiberNode.rendersCount++;
                fiberNode.resetStateIndex(); // why we reset stateIndex?

                const patchTree = reconsilation(fiberNode.child, newFiberVersion)

                // fiberNode.children[0].element.remove();
                // fiberNode.children[0] = newFiberVersion;
                Liba.onFiberTreeChanged(fiberNode.child, newFiberVersion, patchTree)
                fiberNode.child = newFiberVersion;
            })

            fiberNode.pushState([wrapper, setValue]);

            return [wrapper.value, setValue]
        } else {
            return fiberNode.getState();
        }
    }
}


