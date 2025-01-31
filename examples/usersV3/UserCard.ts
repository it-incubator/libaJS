export function UserCard(props, { liba }) {
  const {
    user,
  } = props;

  const [count, setCount] = liba.useState(0)


  return liba.create('div', {
    children: [
      liba.create('div', {
        children: [user.name]
      }),
      liba.create('div', {
        children: ['count: ' + count]
      }),
      liba.create('button', {
      children: ['c: ' + count],
      onClick: () => {
        setCount((prev: number) => prev + 1)
      }
    }),]
  });
}
