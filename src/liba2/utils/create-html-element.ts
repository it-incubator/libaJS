interface HtmlElementProps {
    [key: string]: any; // Общий тип для всех атрибутов, включая события и children
    children?: (HTMLElement | string | number)[]; // Массив для детей (элементы, строки или числа)
}

export function createHtmlElement(tagName: keyof HTMLElementTagNameMap, props: HtmlElementProps = {}): HTMLElement {
    // Создаем элемент на основе переданного имени тега
    const element = document.createElement(tagName);

    // Обрабатываем остальные атрибуты и события
    Object.keys(props).forEach(key => {
        if (key === 'children') return; // Пропускаем ключ "children", так как он уже обработан

        if (key.startsWith('on') && typeof props[key] === 'function') {
            const event = key.slice(2).toLowerCase();
            element.addEventListener(event, props[key]); // Добавляем слушатель события
        }
        else if (key === 'checked' && tagName === 'input') {
            (element as HTMLInputElement).checked = Boolean(props[key]);
        }
        else if (key === 'value' && (tagName === 'input' || tagName === 'textarea' || tagName === 'select')) {
            (element as HTMLInputElement | HTMLTextAreaElement).value = props[key];
        }
        else if (key === 'disabled') {
            element[key] = Boolean(props[key]);
        }
        else {
            element.setAttribute(key, props[key]); // Добавляем обычные атрибуты
        }
    });

    // Возвращаем созданный элемент
    return element;
}
