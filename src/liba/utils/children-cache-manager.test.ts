import { CacheManager } from './children-cache-manager'; // предположим, что ваш класс находится в файле CacheManager.ts

describe('CacheManager', () => {
    let cacheManager: CacheManager<any>;

    beforeEach(() => {
        cacheManager = new CacheManager<any>();
    });

    test('добавление элемента с новым типом создает новую группу', () => {
        cacheManager.addItem({ name: 'item1' }, 'type1');
        expect(cacheManager.getItem('type1')).toEqual({ name: 'item1' });
    });

    test('добавление элемента с тем же типом добавляет его в ту же группу', () => {
        cacheManager.addItem({ name: 'item1' }, 'type1');
        cacheManager.addItem({ name: 'item2' }, 'type1');
        expect(cacheManager.getItem('type1')).toEqual({ name: 'item1' });
        expect(cacheManager.getItem('type1', 1)).toEqual({ name: 'item2' });
    });

    test('добавление элемента с новым ключом в ту же группу', () => {
        cacheManager.addItem({ name: 'item1' }, 'type1');
        cacheManager.addItem({ name: 'item2' }, 'type1', 'customKey');
        expect(cacheManager.getItem('type1')).toEqual({ name: 'item1' });
        expect(cacheManager.getItem('type1', 'customKey')).toEqual({ name: 'item2' });
    });

    test('добавление элемента с тем же ключом выводит предупреждение', () => {
        console.warn = jest.fn(); // Подменяем console.warn на mock функцию

        cacheManager.addItem({ name: 'item1' }, 'type1', 'customKey');
        cacheManager.addItem({ name: 'item2' }, 'type1', 'customKey');

        expect(console.warn).toHaveBeenCalledWith('Warning: The key "customKey" already exists in the group "type1".');
    });

    test('добавление элемента с измененным типом создает новую группу', () => {
        cacheManager.addItem({ name: 'item1' }, 'type1');
        cacheManager.addItem({ name: 'item2' }, 'type2');
        expect(cacheManager.getItem('type2')).toEqual({ name: 'item2' });
    });

    test('возврат undefined для несуществующего элемента или группы', () => {
        expect(cacheManager.getItem('nonExistentType')).toBeUndefined();
        cacheManager.addItem({ name: 'item1' }, 'type1');
        expect(cacheManager.getItem('type1', 'nonExistentKey')).toBeUndefined();
    });
});


describe('CacheManager with function type', () => {
    let cacheManager: CacheManager<any>;

    beforeEach(() => {
        cacheManager = new CacheManager<any>();
    });

    test('может использовать функцию в качестве типа группы', () => {
        const funcType = () => {};
        const funcType2 = () => {};

        cacheManager.addItem({ name: 'item1' }, funcType);
        cacheManager.addItem({ name: 'item2' }, funcType2);

        expect(cacheManager.getItem(funcType)).toEqual({ name: 'item1' });
        expect(cacheManager.getItem(funcType2)).toEqual({ name: 'item2' });
    });

    test('создает новую группу для измененного типа функции', () => {
        const funcType = () => {};

        cacheManager.addItem({ name: 'item1' }, funcType);
        cacheManager.addItem({ name: 'item2' }, funcType);

        expect(cacheManager.getItem(funcType)).toEqual({ name: 'item1' });
    });
});
