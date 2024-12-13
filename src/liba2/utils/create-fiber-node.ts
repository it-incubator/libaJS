import {StateWrapper, StateWrapperWithSetter} from "./use-state.ts";

export class FiberNode {
     status: string;
     cleanups: any[];
     element: null;
     parentElement: null;
     props: any;
     type: any;
     children: any[];
     virtualNode: any;
     // сколько раз ueState вызывается в компоненте, столько будет здесь элементов
     stateNode: StateWrapperWithSetter<any>[] = []
     rendersCount = 0


    constructor(
        ComponentFunctionOrTagName: any, props: any) {
        this.status = 'created'
        this.cleanups = []

        this.element = null
        this.parentElement = null;
        const {children, ...restProps} =  props
        this.props = restProps as any
        this.type = ComponentFunctionOrTagName as any
        this.children = []
    }

    pushState(stateWrapperWithSetter: StateWrapperWithSetter<any>) {
        this.stateNode.push(stateWrapperWithSetter)
    }

    static isPrimitive(fiberNode: any) {
         return typeof fiberNode ==='string' || typeof fiberNode === 'number'
    }
}

