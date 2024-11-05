export function App(_, {liba}: any) {
//    const [user, setUser] = liba.useState({name:'Nikita'});

    return liba.create('div', { //<div>
        children: [
            'hello world',
            liba.create('button', {
                children: ['Загрузить пользователей']
            }),
            liba.create('section', {
                children: [  liba.create('button', {
                    children: ['Удалить пользователей']
                })]
            }),
            // liba.create(UserCard, {user}, {key: user.id})
        ]
    });


}


const liba = {
    create(type: any, props: any) {
        const node = {
            type,
            props: { ...props, children: [] },
            parent: null,
        };

        // Если есть дочерние элементы, рекурсивно создаем их
        if (props?.children) {
            node.props.children = props.children.map(child => {
                // Если дочерний узел — строка, создаем текстовый узел
                if (typeof child === 'string') {
                    return { type: 'text', value: child, parent: node };
                }
                // Если дочерний узел — объект, создаем его через liba.create
                const childNode = liba.create(child.type, child.props);
                childNode.parent = node; // Устанавливаем родителя для дочернего узла
                return childNode;
            });
        }

        return node;
    }
};

// Пример использования
const tree = liba.create('div', {
    children: [
        'hello world',
        liba.create('button', {
            children: ['Загрузить пользователей']
        }),
        liba.create('section', {
            children: [
                liba.create('button', {
                    children: ['Удалить пользователей']
                })
            ]
        })
    ]
});

console.log(tree);
