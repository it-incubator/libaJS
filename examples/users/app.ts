import {UserCard} from "./UserCard";

export function App(_, {liba}: any) {
   // const [user, setUser] = liba.useState({name:'Nikita'});
    let user = {id: 1, name:'Nikita'}

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
            liba.create('section', {
                children: [  liba.create('button', {
                    children: ['Удалить пользователей']
                })]
            }),
            liba.create(UserCard, {user})
        ]
    });


}

