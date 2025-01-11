import {UserCard} from "./UserCard";

export function App(_, {liba}: any) {
    const [users, setUsers] = liba.useState([{id: 1, name:'Nikita'}, {id: 2, name:'Vladislav'}]);

    const [count, setCount] = liba.useState(0)


    return liba.create('div', { //<div>
        children: [
          //   'hello world',
          //   liba.create('button', {
          //       children: [count],
          //       onClick: () => {
          //           setCount((prev: number) => prev + 1)
          //       }
          //   }),
          //   liba.create('section', {
          //       children: [  liba.create('button', {
          //           children: ['Do nothing']
          //       })]
          //   }),
            liba.create("div", {children:  users.map(u => liba.create(UserCard, {user: u}))}),
            // users.length === 3 ? '----' : liba.create('button', {
            //     children: ['Add new user'],
            //     onClick: () => {
            //         setUsers([...users, {id: Date.now(), name: 'name new'}])
            //     }
            // }),
            // users.length === 3 ? liba.create('span', {children: ['LIMIT']}) : liba.create('button', {
            //     children: ['Add new user'],
            //     onClick: () => {
            //         setUsers([...users, {id: Date.now(), name: 'name new'}])
            //     }
            // }),
            //
            //
            //
          //  users.length === 2 ? liba.create('h1', {children: ['LENGTH === 2']}) : liba.create('h3', {children: ['LENGTH > 2']}),
           // users.length === 2 ? null : liba.create('h3', {children: ['LENGTH > 2']}),

            liba.create('button', { // todo:  окгда у нас в качестве эелмеента null... нужно тот кейс отработать...
                children: ['Add new user'],
                onClick: () => {
                    setUsers([...users, {id: Date.now(), name: 'name new'}])
                }
            }),
            liba.create('hr')
        ]
    });


}

