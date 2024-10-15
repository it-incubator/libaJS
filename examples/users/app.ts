import {makeRequest} from "./utils/makeRequest.ts";
import {UserCard} from './UserCard.ts';


export function App(_, {liba}) {
    const [user, setUser] = liba.useState({name:'Nikita'});

    return liba.create('div', {
        children: [
            liba.create('button', {
                children: ['Загрузить пользователей']
            }),
            liba.create(UserCard, {user}, {key: user.id})
        ]
    });


}
