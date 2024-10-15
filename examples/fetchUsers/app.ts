import {makeRequest} from "./utils/makeRequest.ts";
import {UserCard} from './UserCard.ts';

const getUsers = () => makeRequest('https://jsonplaceholder.typicode.com/users');

export function App(_, {liba}) {


    const [users, setUsers] = liba.useState([]);
    const [isLoading, setIsLoading] = liba.useState(false);

    const onClickButton = async () => {
        setIsLoading(true);
        const users = await getUsers();
        setIsLoading(false);
        setUsers(users);
    };

    if (isLoading) {
        return liba.create('div', {
          children: [
            liba.create('button', {
              children: ['Загрузить пользователей'],
              onClick: onClickButton,
            }),
            'Загрузка...']
        })
    }

    return liba.create('div', {
        children: [
            liba.create('button', {
                children: ['Загрузить пользователей'],
                onClick: onClickButton,
            }),
            users
                .filter((u, i) => i < 1)
                .map((user) => {
                return liba.create(UserCard, {user}, {key: user.id})
            })
        ]
    });


}
