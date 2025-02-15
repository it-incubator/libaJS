import {createHtmlElement} from "../../utils/create-html-element.ts";

export function renderFiberNode(fiberNode: any, parentElement: any, insertPlace: 'append' | 'after' = 'append') {
    let element
    if (fiberNode === null) return null;
    // если это псевдофайбер - тупой текстовый узел..
    // то просто всятавить в родителя
    if (['string', 'number'].some(v => v === typeof fiberNode)) {
        insertPlace === 'append' ? parentElement?.append(fiberNode) : parentElement.after(fiberNode)
        return;
    }
    // если это html тэг - создать элемент и в родителя вставить
    else if (typeof fiberNode.type === 'string') {
        element = createHtmlElement(fiberNode.type, fiberNode.props)
        fiberNode.element = element;
        switch (insertPlace) {
            case 'append':
                //fiberNode.parentElement = parentElement
                parentElement?.append(element)
                break;
            case 'after':
               // fiberNode.parentElement = parentElement
                parentElement.after(element)
                break;
        }
    } else {
        // если это не тег - значит какой-то компонент, который
        // по сути не надо рисовать.. нечего там рисовать.
        // поэтому будем пробегать по его детям ниже... но в качестве родителя
        // пердадим не себя как родителя, а нашего родителя, ведь здесь
        // настоящий html элемент
       // fiberNode.parentElement = parentElement; // нужно это??
        element = parentElement;
    }

    //fiberNode.children?.forEach((child: any) => renderFiberNode(child, element))

    let child = fiberNode.child;
    renderFiberNode(child, element)

    let currentSibling = child?.sibling;
    while (currentSibling) {
        renderFiberNode(currentSibling, element);
        currentSibling = currentSibling.sibling;
    }

    return element;
}
