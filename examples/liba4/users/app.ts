import { Liba } from "../../../src/liba4/Liba";
import { UserCard } from "./UserCard";

export function App(_) {
  const [users, setUsers] = Liba.useState([{id: 1, name:'Nikita'}, {id: 2, name:'Vladislav'}]);

  const [count, setCount] = Liba.useState(0);

  return Liba.create('div', {
      children: [
        Liba.create("div", {children:  users.map(u => Liba.create(UserCard, {user: u, key: u.id}))}),
        Liba.create('button', {
          children: ['Add new user'],
          onClick: () => {
              setUsers([...users, {id: Date.now(), name: 'name new'}])
          }
        }),
      ]
  });


}

