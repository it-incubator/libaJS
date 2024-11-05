import {FiberNode, FiberNode} from "./utils/create-fiber-node.ts";
import {createVirtualNode} from "./utils/create-virtual-node.ts";

export const Liba: any = {
    create(ComponentFunctionOrTagName, props = {}, {parentFiber}: {parentFiber?:any} = {}) {
           const fiberNode = new FiberNode(ComponentFunctionOrTagName, props)

           if (parentFiber) {
               parentFiber.children.push(fiberNode)
           }

           if (typeof ComponentFunctionOrTagName === 'function') {
               const renderLiba = {
                   create(childComponentFunctionOrTag: any, props = {}) {
                       return Liba.create(childComponentFunctionOrTag, props, {parentFiber: fiberNode})
                   }
               }

               const childFiberNode = ComponentFunctionOrTagName(props, {
                   liba: renderLiba
               })

               //const virtualNode = createVirtualNode(ComponentFunction, props)
               fiberNode.virtualNode = createVirtualNode(fiberNode);
           } else {
               fiberNode.virtualNode = createVirtualNode(fiberNode);
           }

           return fiberNode;
    }
}


