import {setAttribute} from "../utils/create-html-element.ts";
import {Liba} from "../Liba.ts";
import {renderFiberNode} from "./utils/RenderFiberNode.ts";

Liba.onFiberTreeChanged = (prevFiber, newFiber, patchesTree) => {
    patch(prevFiber, newFiber, patchesTree)
}

function patch(prevFiber, newFiber,  patchObj, index = 0) {
    if (!patchObj) return;

    let el;
    if (patchObj.type === 'UPDATE' || patchObj.type === 'TEXT') {
        el = prevFiber.element;
        newFiber.element = prevFiber.element;
    }
    switch (patchObj.type) {
        case 'CREATE': {
            renderFiberNode(patchObj.newVNode, prevFiber.element)
            break;
        }
        case 'REMOVE': {
            if (el) {
                el.removeChild(el);
            }
            break;
        }
        case 'REPLACE': {
            const element = renderFiberNode(patchObj.newVNode, null)
             prevFiber.parentElement.replaceChild(element, prevFiber.element);
            break;
        }
        case 'TEXT': {
            if (el) {
                el.textContent = patchObj.newVNode;
            }
            break;
        }
        case 'UPDATE': {
            if (el) {
                const { props, children } = patchObj;

                props.forEach(({ key, value }) => {
                    setAttribute(el, key, value)
                });

                children.forEach((childPatch, i) => {
                    if (childPatch == null) return;

                    if (childPatch.type === 'TEXT') {
                        patch(prevFiber, newFiber, childPatch, i);
                    } else if  (childPatch.type === 'CREATE') {
                        patch(prevFiber, newFiber.children[i], childPatch, i);
                    }
                    else {
                        patch(prevFiber.children[i], newFiber.children[i], childPatch, i);
                    }
                });
            }
            break;
        }
    }
}


export const LibaDOM: any = {
    createRoot(rootElement: any) {
        return {
            render(fiberNode: any) {
                renderFiberNode(fiberNode, rootElement)
            }
        }
    }
}


