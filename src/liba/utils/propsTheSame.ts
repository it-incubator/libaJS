export function propsTheSame<T extends {}>(prevProps: T, newProps: T): boolean {
    if (prevProps === newProps) return true;

    if ((prevProps == null && newProps != null) || (prevProps != null && newProps == null)) {
        return false;
    }

    const prevKeys = Object.keys(prevProps || {});
    const newKeys = Object.keys(newProps || {});

    if (prevKeys.length !== newKeys.length) {
        return false;
    }

    for (let key of prevKeys) {
        if (typeof prevProps[key] === 'function' && typeof newProps[key] === 'function') {
            continue; // Пропускаем функции
        }

        if (prevProps[key] !== newProps[key]) {
            return false;
        }
    }

    return true;
}
