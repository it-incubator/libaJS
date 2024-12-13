import {createHtmlElement, setAttribute} from "./utils/create-html-element.ts";
import { Liba } from "../../src/liba2/Liba";

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
            const newEl = createHtmlElement(patchObj.newVNode);
            if (el) {
                el.replaceChild(newEl, el);
            } else {
                el.appendChild(newEl);
            }
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


export function renderFiberNode(fiberNode: any, parentElement: any) {
    let element
    // если это псевдофайбер - тупой текстовый узел..
    // то просто всятавить в родителя
    if (['string', 'number'].some(v => v === typeof fiberNode)) {
        parentElement.append(fiberNode)
        return;
    }
    // если это html тэг - создать элемент и в родителя вставить
    else if (typeof fiberNode.type === 'string'){
        element = createHtmlElement(fiberNode.virtualNode.type, fiberNode.props)
        fiberNode.element = element;
        fiberNode.parentElement = parentElement
        parentElement.append(element)
    } else {
        // если это не тег - значит какой-то компонент, который
        // по сути не надо рисовать.. нечего там рисовать.
        // поэтому будем пробегать по его детям ниже... но в качестве родителя
        // пердадим не себя как родителя, а нашего родителя, ведь здесь
        // настоящий html элемент
        fiberNode.parentElement = parentElement; // нужно это??
        element = parentElement;
    }

    fiberNode.children?.forEach((child: any) => renderFiberNode(child, element))
}