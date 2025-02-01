import {StateWrapperWithSetter} from "./use-state.ts";

export class FiberNode {
     status: string;
     cleanups: any[];
     element: null;
     parentElement: null;
     props: any;
     type: any;
     children: any[];
     child: FiberNode | null = null
     sibling: FiberNode | null = null
     parent: FiberNode | null = null

     // сколько раз ueState вызывается в компоненте, столько будет здесь элементов
     stateNode: StateWrapperWithSetter<any>[] = []
     rendersCount = 0
    /**
     * текущий индекс вызова функции useState в текущем рендере
     */
     currentStateIndex = 0


    constructor(
        ComponentFunctionOrTagName: any, props: any, defaultFiberNodeFields?: any) {
        this.status = 'created'
        this.cleanups = []

        this.element = null
        this.parentElement = null;
        const {children, ...restProps} = props
        this.props = restProps as any
        this.type = ComponentFunctionOrTagName as any
        this.children = []

        if (defaultFiberNodeFields?.stateNode) {
            this.stateNode = defaultFiberNodeFields.stateNode;
        }

        if (defaultFiberNodeFields?.rendersCount) {
            this.rendersCount = defaultFiberNodeFields.rendersCount;
        }
    }

    pushState(stateWrapperWithSetter: StateWrapperWithSetter<any>) {
        this.stateNode.push(stateWrapperWithSetter)
    }
    getState(){
        const state = [this.stateNode[this.currentStateIndex][0].value, this.stateNode[this.currentStateIndex][1]];
        this.currentStateIndex++;
        return state;
    }
    resetStateIndex() {
        this.currentStateIndex = 0;
    }
}