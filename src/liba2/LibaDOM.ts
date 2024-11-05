import {createHtmlElement} from "./utils/create-html-element.ts";

export const LibaDOM: any = {
    createRoot(rootElement: any) {
        return {
            render(fiberNode: any) {
                renderFiberNode(fiberNode, rootElement)
            }
        }
    }
}


function renderFiberNode(fiberNode: any, parentElement: any) {
    if (typeof fiberNode.type === 'string'){
        const element = createHtmlElement(fiberNode.virtualNode.type, fiberNode.props)
        parentElement.append(element)
    } else {
        renderFiberNode(fiberNode.children[0], parentElement)
    }
}