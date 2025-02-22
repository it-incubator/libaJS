import { Liba } from "../../../src/liba4/Liba";

export function FormData() {
  const [data, setData] = Liba.useState(100);

  return Liba.create('div', {
    children: [
      Liba.create('button', {
        children: [`${data}`],
        onClick: () => {
          setData(prev => prev + 100);
        }
      })
    ]
  });
}
