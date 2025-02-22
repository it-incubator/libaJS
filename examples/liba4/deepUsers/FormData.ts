import { Liba } from "../../../src/liba4/Liba";

export function FormData() {
  const [inpitData, setInputData] = Liba.useState('empty');

  return Liba.create('div', {
    children: [
      Liba.create('input', {
        value: inpitData,
        onChange: (e) => {
          setInputData(e.currentTarget.value);
        }
      })
    ]
  });
}
