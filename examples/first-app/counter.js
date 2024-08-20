export function Counter(_, { liba }) {
  const element = document.createElement("div");

  const localState = liba.useState({
    counter: 1,
  });

  const interval = setInterval(() => {
    localState.counter = localState.counter + 1;
  }, 1000);

  return {
    element,
    localState,
    cleanup: () => {
      clearInterval(interval);
    },
  };
}

Counter.render = ({ element, localState }) => {
  const { counter = 1 } = localState ?? {};
  element.append(counter);
};
