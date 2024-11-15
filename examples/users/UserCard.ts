export function UserCard(props, { liba }) {
  const {
    user,
  } = props;

  const [count, setCount] = liba.useState(0)

  const child =  liba.create('div', {
    children: [user.name]
  })

  return liba.create('div', {
    children: [
        child,
      liba.create('button', {
      children: ['button inside user: ' + count],
      onClick: () => {
        setCount((prev: number) => prev + 1)
      }
    }),]
  });
}
