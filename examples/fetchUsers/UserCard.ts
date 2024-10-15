export function UserCard(props, { liba }) {
  const {
    user,
  } = props;

  liba.create('div');

  liba.create('div', {
    children: [user.name]
  });
}
