export function App(_, { liba }) {
  return liba.createElement('div', {}, [
    liba.createElement('div', {}, 
      liba.createElement('span', {}, 'Просто SPAN')
    ),
    liba.createElement('div', {}, 'Просто DIV1'),
    liba.createElement('div', {}, 
      liba.createElement(Button, {})
    ),
  ]);
};

const Button = (_, { liba }) => {
  const onclick = () => {
    alert('Клик');
  }

  return liba.createElement('button', { onclick }, 'Кнопка');
}