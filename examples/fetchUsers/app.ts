import { makeRequest } from "./utils/makeRequest.ts";
import { UserCard } from './UserCard.ts';

const getUsers = () => makeRequest('https://jsonplaceholder.typicode.com/users');

export function App(_, {liba}) {
  const element = document.createElement("div");

  const [, setUsers] = liba.useState([]);
  const [, setIsLoading] = liba.useState(false);

  const onClickButton = async () => {
    setIsLoading(true);
    const users = await getUsers();
    setIsLoading(false);
    setUsers(users);
  };

  return {
    element,
    props: { onClickButton },
  }
}

App.render = ({ element, statesWithSetters, liba, props }) => {
  const {
    onClickButton,
  } = props;

  const buttonElement = document.createElement('button');
  buttonElement.innerHTML = 'Загрузить пользователей';
  buttonElement.onclick = onClickButton;

  element.append(buttonElement);
  
  const [[users], [isLoading]] = statesWithSetters;

  if (isLoading) {
    element.append('Загрузка...')
    return;
  }

  users.map((user, i) => {
    const userCardComponent = liba.create(UserCard, { user }, { key: i });
    element.append(userCardComponent.element);
  })
};
