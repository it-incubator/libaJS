import {setAttribute} from "../utils/create-html-element.ts";
import {Liba} from "../Liba.ts";
import {renderFiberNode} from "./utils/RenderFiberNode.ts";

Liba.onFiberTreeChanged = (prevFiber, newFiber, patchesTree) => {
    patch(prevFiber, newFiber, patchesTree)
}

function patch(prevFiber, newFiber,  patchObj) {
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
                const { props, child: childPatch, sibling: siblingPatch } = patchObj;

                props.forEach(({ key, value }) => {
                    setAttribute(el, key, value)
                });

                if (childPatch != null)  {
                    if (childPatch.type === 'TEXT') {
                        patch(prevFiber, newFiber, childPatch);
                    } else if  (childPatch.type === 'CREATE') {
                        patch(prevFiber, newFiber.child, childPatch);
                    }
                    else {
                        patch(prevFiber.child, newFiber.child, childPatch);
                    }
                }


                if (siblingPatch != null) {
                    if (siblingPatch.type === 'TEXT') {
                        patch(prevFiber, newFiber, siblingPatch);
                    } else if (siblingPatch.type === 'CREATE') {
                        patch(prevFiber, newFiber.sibling, siblingPatch);
                    } else {
                        patch(prevFiber.child.sibling, newFiber.child.sibling, siblingPatch);
                    }
                }
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


