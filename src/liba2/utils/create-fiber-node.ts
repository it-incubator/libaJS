export class FiberNode {
     status: string;
     cleanups: any[];
     element: null;
     props: any;
     type: any;
     children: any[];
     virtualNode: any;

    constructor(
        ComponentFunctionOrTagName: any, props: any) {
        this.status = 'created'
        this.cleanups = []

        this.element = null

        this.props = props as any
        this.type = ComponentFunctionOrTagName as any
        this.children = []
    }
}