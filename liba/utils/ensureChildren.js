export function ensureChildren(parent) {
    if (parent) {
        if (!parent.childrenComponents) parent.childrenComponents = []
    }
}