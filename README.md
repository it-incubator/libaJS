# Project Title

Учебный opensource проект, посвящённый созданию собственной альтернативы React/Vue/Angular 

Разрабатываем сообществом [DevClub](https://it-incubator.io/dev-club)

## Usage

Instructions for use will be later.

## Best Framework over the world

![Alt text](logo/logo.png) 

## License

Add your license information here.


настройку проекта подсмотрели здесь:
https://dev.to/vinomanick/create-a-typescript-utility-library-using-vite-916

about GroupCacheManager
https://chatgpt.com/share/2813fe42-b11b-476e-a7ff-7c62c78e6a39


# TASKS

- ✅ глобальная задача: избавиться от метода render (по факту сначала избавимся от логики внутри компонента, а потом 
перенесём её из рендер в компонент и избавимся от render)
- ✅ create useEffect,
- ✅ адапртировать useState под вызов его в методе render
- ✅ не возвращать инстанс из компонента
- ✅ создавать корневой элемент в методе render 

- ✅ если между рендерами кол-во вызовов хуков меняется - генерировать ошибку (hackertask)
- ✅ добавить в useEffect массив зависимостей (hackertask)
- 🟩 create tree component structure (on the lesson)
- 🟩 VDOM -> real DOM (on the lesson)
- 🟩 reconcilation: rewrite cacheManager like react fiber tree (on the lesson)
- 🟩 must remove componentInstance.element.innerHTML = ''
- 🟩 liba.createSignal, liba.createComputed, liba.creteEffect (hackertask)
- 🟩 refactoring, typescript
- 🟩 transpiler JSX to liba
- 🟩 documentation
- 🟩 correct npm package 

