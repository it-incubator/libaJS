import {setAttribute} from "../utils/create-html-element.ts";
import {Liba} from "../Liba.ts";
import {renderFiberNode} from "./utils/RenderFiberNode.ts";
import {createFiberCanvasRenderer} from "../../shared/renderCanvasFiberTree.ts";
import {createPatchCanvasRenderer} from "../../shared/renderCanvasPatchTree.ts";

Liba.onFiberTreeChanged = (prevFiber, newFiber, patchesTree) => {
    createFiberCanvasRenderer()(newFiber, "newFiberNode");
    createFiberCanvasRenderer()(prevFiber, "prevFiberNode");
    createPatchCanvasRenderer()(patchesTree, "patchTree");
    window.patchesTree = patchesTree;
    patch(prevFiber, newFiber, patchesTree)
    createFiberCanvasRenderer()(windowFiberNode, "currentFullTree");
}

function patch(prevFiberOrParentFiberOrLeftSiblingFiber, newFiber,  patchObj, typeOfPrevFiber: 'similar' | 'parent' | 'left-sibling') {
    if (!patchObj) return;

    let el;
    if (patchObj.type === 'UPDATE' || patchObj.type === 'TEXT') {
        el = prevFiberOrParentFiberOrLeftSiblingFiber.element;
        newFiber.element = prevFiberOrParentFiberOrLeftSiblingFiber.element;
    }

    switch (patchObj.type) {
        case 'CREATE': {
            switch (typeOfPrevFiber) {
                case 'parent':
                    renderFiberNode(patchObj.newVNode, prevFiberOrParentFiberOrLeftSiblingFiber.element, 'after')
                    break;
                case 'left-sibling':
            }

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
             prevFiberOrParentFiberOrLeftSiblingFiber.parent.element.replaceChild(element, prevFiberOrParentFiberOrLeftSiblingFiber.element);
            break;
        }
        case 'TEXT': {
            if (el) {
                el.textContent = patchObj.newVNode;
            }
            break;
        }
        case 'UPDATE': {
            // if (el) {
                const { props, child: childPatch, sibling: siblingPatch } = patchObj;

                props.forEach(({ key, value }) => {
                    setAttribute(el, key, value)
                });

                if (childPatch != null)  {
                    if (childPatch.type === 'TEXT') {
                        patch(prevFiberOrParentFiberOrLeftSiblingFiber, newFiber, childPatch, 'similar');
                    } else if  (childPatch.type === 'CREATE') {
                        patch(prevFiberOrParentFiberOrLeftSiblingFiber,  newFiber.child, childPatch, 'parent');
                    }
                    else {
                        patch(prevFiberOrParentFiberOrLeftSiblingFiber.child, newFiber.child, childPatch, 'similar');
                    }
                }


                if (siblingPatch != null) {
                    if (siblingPatch.type === 'TEXT') {
                        patch(prevFiberOrParentFiberOrLeftSiblingFiber, newFiber, siblingPatch, 'similar');
                    } else if (siblingPatch.type === 'CREATE') {
                        patch(prevFiberOrParentFiberOrLeftSiblingFiber, newFiber.sibling, siblingPatch, 'left-sibling');
                    } else {
                        patch(prevFiberOrParentFiberOrLeftSiblingFiber.sibling, newFiber.sibling, siblingPatch, 'similar');
                    }
                }
            // }
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


