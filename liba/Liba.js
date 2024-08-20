function ensureChildren(parent) {
  if (parent) {
    if (!parent.childrenComponents) parent.childrenComponents = [];
  }
}

function propsTheSame(prevProps, newProps) {
  if (prevProps === newProps) return true;

  if (
    (prevProps == null && newProps != null) ||
    (prevProps != null && newProps == null)
  ) {
    return false;
  }

  const prevKeys = Object.keys(prevProps || {});
  const newKeys = Object.keys(newProps || {});

  if (prevKeys.length !== newKeys.length) {
    return false;
  }

  for (let key of prevKeys) {
    if (prevProps[key] !== newProps[key]) {
      return false;
    }
  }

  return true;
}

function deepEqual(value1, value2) {
  if (value1 === value2) {
    return true;
  }

  // Check if both values are objects (and not null, as typeof null is 'object')
  if (
    value1 === null ||
    value2 === null ||
    typeof value1 !== "object" ||
    typeof value2 !== "object"
  ) {
    return false;
  }

  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) {
      return false;
    }
    for (let i = 0; i < value1.length; i++) {
      if (!deepEqual(value1[i], value2[i])) {
        return false;
      }
    }
    return true;
  }

  if (Array.isArray(value1) !== Array.isArray(value2)) {
    return false;
  }

  // Check if both values are objects
  const keys1 = Object.keys(value1);
  const keys2 = Object.keys(value2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(value1[key], value2[key])) {
      return false;
    }
  }

  return true;
}

export const Liba = {
  create(ComponentFunction, props = {}, { parent } = { parent: null }) {
    const debounceDelay = 99;
    let timeoutId;
    const localChanges = new Map();

    const renderLiba = {
      create: (ChildrenComponentFunction, props = {}) => {
        componentInstance.childrenIndex++;

        const alreadyExistedComponentInstance =
          componentInstance.childrenComponents?.[
            componentInstance.childrenIndex
          ];

        if (alreadyExistedComponentInstance) {
          if (
            alreadyExistedComponentInstance.type === ChildrenComponentFunction
          ) {
            if (propsTheSame(props, alreadyExistedComponentInstance.props)) {
              return alreadyExistedComponentInstance;
            } else {
              alreadyExistedComponentInstance.props = props;
              alreadyExistedComponentInstance.refresh();
              return alreadyExistedComponentInstance;
            }
          } else {
            delete componentInstance.childrenComponents[
              componentInstance.childrenIndex
            ];
          }
        }

        const childInstance = Liba.create(ChildrenComponentFunction, props, {
          parent: componentInstance,
        });

        return childInstance;
      },
      refresh() {
        // todo: if element doesn't hav innerHTML??
        componentInstance.element.innerHTML = "";

        componentInstance.childrenComponents?.forEach((cc) => cc.cleanup?.());
        //componentInstance.childrenComponents = []

        renderComponent();
      },
    };

    const componentLiba = {
      refresh: renderLiba.refresh,
      useState: (initialState = {}) => {
        const refresh = componentLiba.refresh;

        const handler = {
          get(target, property, receiver) {
            const value = Reflect.get(target, property, receiver);

            // If you need to handle nested objects with proxies while ensuring that arrays and other types work correctly,
            // you should conditionally create proxies only for objects.
            if (typeof value === "object" && value !== null) {
              return new Proxy(value, handler);
            }

            return value;
          },

          set(target, property, value, receiver) {
            const key = `${target}:${property}`;
            const oldValue = target[property];

            localChanges.set(key, {
              target,
              property,
              value,
              oldValue,
              receiver,
            });

            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
              let needRefresh;

              for (const {
                target,
                property,
                value,
                receiver,
                oldValue,
              } of localChanges.values()) {
                Reflect.set(target, property, value, receiver);

                if (!needRefresh && !deepEqual(oldValue, value)) {
                  needRefresh = true;
                }
              }

              if (needRefresh) {
                refresh();
              }

              localChanges.clear();
            }, debounceDelay);

            return true;
          },
        };

        return new Proxy(initialState, handler);
      },
    };

    const componentInstance = ComponentFunction(props, { liba: componentLiba });

    componentInstance.type = ComponentFunction;

    componentInstance.refresh = renderLiba.refresh;

    if (parent) {
      ensureChildren(parent);
      parent.childrenComponents[parent.childrenIndex] = componentInstance;
    }

    function renderComponent() {
      componentInstance.childrenIndex = -1;

      ComponentFunction.render({
        element: componentInstance.element,
        localState: componentInstance.localState,
        props: componentInstance.props,
        liba: renderLiba,
      });
    }

    renderComponent();

    return componentInstance;
  },
  refresh() {},
};
