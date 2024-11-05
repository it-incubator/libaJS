export const createVirtualNode = (fiberNode: any): any => {
    return {
        type: fiberNode.type,
        props: fiberNode.props,
        key: fiberNode.key
    }
}