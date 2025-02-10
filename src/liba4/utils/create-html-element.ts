interface HtmlElementProps {
    [key: string]: any; // Общий тип для всех атрибутов, включая события и children
    children?: (HTMLElement | string | number)[]; // Массив для детей (элементы, строки или числа)
}

export function createHtmlElement(tagName: keyof HTMLElementTagNameMap, props: HtmlElementProps = {}): HTMLElement {
    // Создаем элемент на основе переданного имени тега
    const element = document.createElement(tagName);

    // Обрабатываем остальные атрибуты и события
    Object.keys(props).forEach(key => {
        setAttribute(element, key, props[key])
    });

    // Возвращаем созданный элемент
    return element;
}

export function setAttribute(element, key, value) {
    if (key === 'children') return; // Пропускаем ключ "children", так как он уже обработан

    const tagName = element.tagName.toLowerCase()

    if (key.startsWith('on') && typeof value === 'function') {
        element[key.toLowerCase()] = value; // Добавляем слушатель события
    }
    else if (key === 'checked' && tagName === 'input') {
        (element as HTMLInputElement).checked = Boolean(value);
    }
    else if (key === 'value' && (tagName === 'input' || tagName === 'textarea' || tagName === 'select')) {
        (element as HTMLInputElement | HTMLTextAreaElement).value = value;
    }
    else if (key === 'disabled') {
        // @ts-ignore
        element[key] = Boolean(value);
    }
    else {
        element.setAttribute(key, value); // Добавляем обычные атрибуты
    }
}
