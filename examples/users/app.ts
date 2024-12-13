import {UserCard} from "./UserCard";

export function App(_, {liba}: any) {
   // const [user, setUser] = liba.useState({name:'Nikita'});
    let user1 = {id: 1, name:'Nikita'}
    let user2 = {id: 2, name:'Vladislav'}

    const [count, setCount] = liba.useState(0)


    return liba.create('div', { //<div>
        children: [
           // 'hello world',
            liba.create('button', {
                children: [count],
                onClick: () => {
                    setCount((prev: number) => prev + 1)
                }
            }),
            // liba.create('section', {
            //     children: [  liba.create('button', {
            //         children: ['Удалить пользователей']
            //     })]
            // }),
            //liba.create(UserCard, {user: user1}),
           // liba.create(UserCard, {user: user2}),
        ]
    });


}

