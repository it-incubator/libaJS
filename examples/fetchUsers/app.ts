import { makeRequest } from "./utils/makeRequest.ts";
import { UserCard } from './UserCard.ts';

const getUsers = () => makeRequest('https://jsonplaceholder.typicode.com/users');

export function App(_, {liba}) {
  liba.create('div');

  const [users, setUsers] = liba.useState([]);
  const [isLoading, setIsLoading] = liba.useState(false);

  const onClickButton = async () => {
    setIsLoading(true);
    const users = await getUsers();
    setIsLoading(false);
    setUsers(users);
  };

  liba.create('button', {
    children: ['Загрузить пользователей'],
    onClick: onClickButton,
  });

  if (isLoading) {
    liba.create('div', {
      children: ['Загрузка...']
    })
    return;
  }

  users.forEach((user) => {
    liba.create(UserCard, { user }, { key: user.id })
  })
}
