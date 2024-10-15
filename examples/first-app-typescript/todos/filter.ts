export function Filter(props, {liba}) {
    liba.create("div", {
        children: [
            liba.create("button", {
                children: ['all'],
                onClick: () => {props.setFilter('all')}
            }),
            liba.create("button", {
                children: ['done'],
                onClick: () => {props.setFilter('done')}
            }),
            liba.create('button', {
                children: ['active'],
                onClick: () => {props.setFilter('active')}
            })

        ]
    })
    console.log("FILTER RENDERING...")
}
