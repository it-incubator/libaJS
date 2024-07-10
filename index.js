import {App} from "./app.js";

const rootElement = document.getElementById('root')

const appComponent = App();

rootElement.append(appComponent.element)


