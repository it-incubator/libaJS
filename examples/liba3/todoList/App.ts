import { TodoList } from './components/TodoList'

export function App(_, {liba}: any) {
	return liba.create('div', {
		children: [
			liba.create(TodoList),
			liba.create('hr')
		],
	});
}
