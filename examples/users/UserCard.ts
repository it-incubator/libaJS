export function UserCard(props, { liba }) {
  const {
    user,
  } = props;

  const child =  liba.create('div', {
    children: [user.name]
  })

  return liba.create('div', {
    children: [child]
  });
}
