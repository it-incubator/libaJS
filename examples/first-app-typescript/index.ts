import {Liba} from "../../liba/Liba.ts";
import {App} from "./app.ts";

const rootElement = document.getElementById('root')

const appComponent = Liba.create(App);

rootElement?.append(appComponent.element)


