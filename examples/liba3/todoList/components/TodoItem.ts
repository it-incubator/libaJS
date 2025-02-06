export const TodoItem = ({ text, done, onCheck, onClickDelete, id }, { liba }) => (
	liba.create('div', {
		children: [
			liba.create('input', {
				type: 'checkbox',
				checked: done,
				onClick: () => onCheck(id),
			}),
			liba.create('div', {
				children: [text],
				style: done && 'text-decoration: line-through;',
			}),
			liba.create('button', {
				children: ['X'],
				onClick: () => onClickDelete(id),
			})
		],
		style: 'display: flex; gap: 12px;',
	})
);
