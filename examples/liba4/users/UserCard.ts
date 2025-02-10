import { Liba } from "../../../src/liba4/Liba";

export function UserCard(props) {
  const {
    user,
  } = props;

  const [count, setCount] = Liba.useState(0);

  return Liba.create('div', {
    children: [
      Liba.create('div', {
        children: [user.name]
      }),
      Liba.create('div', {
        children: ['count: ' + count]
      }),
      Liba.create('button', {
        children: ['c: ' + count],
        onClick: () => {
          setCount((prev: number) => prev + 1)
        }
      }),
    ]
  });
}
