import { TodoItem } from './TodoItem';

const defaultState = [
	{
		id: 1,
		text: "Task 1",
		done: false,
	},
	{
		id: 2,
		text: "Task 2",
		done: true,
	},
	// {
	// 	id: 3,
	// 	text: "Task 3",
	// 	done: false,
	// },
	// {
	// 	id: 4,
	// 	text: "Task 4",
	// 	done: true,
	// },
];

export const TodoList = (_, { liba }) => {
	const [tasks, setTasks] = liba.useState(defaultState);
	console.log('tasks', tasks);

	const onCheck = (id: any) => {
		setTasks(tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
	};

	const onClickDelete = (id: any) => {
		setTasks(tasks.filter((task) => task.id !== id));
	};

	return liba.create("ui", {
		children: tasks.map((task) => (
			liba.create('li', {
				children: [
					liba.create(TodoItem, {
						...task,
						onCheck,
						onClickDelete,
					}),
				],
				style: 'display: flex',
			})
		))
	});
};
