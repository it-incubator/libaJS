// signals.test.js
import { createSignal, registerEffect, computed } from './createSignal.js';

const NAMES = {
    IT_INCUBATOR: 'it-incubator',
    IT_KAMASUTRA: 'it-kamasutra'
}

describe('Signals and effects', () => {
    it('should update and react to changes in signal', () => {
        const countSignal = createSignal(0);
        let testCountValue = countSignal();

        registerEffect(() => {
            const countValue = countSignal();
            testCountValue = countValue
        });

        expect(testCountValue).toBe(0);

        countSignal.set(5);

        expect(countSignal()).toBe(5);


        expect(testCountValue).toBe(5);

        countSignal.update(value => value + 1);
        expect(testCountValue).toBe(6);
    });

    it('should update signals', () => {

        const countSignal = createSignal(0);
        const nameSignal = createSignal('it-incubator');

        expect(countSignal()).toBe(0)
        expect(nameSignal()).toBe('it-incubator')

        countSignal.set(10);
        nameSignal.set('it-kamasutra')

        expect(countSignal()).toBe(10)
        expect(nameSignal()).toBe('it-kamasutra')

    });


    it('should update and react to changes in 2 signals', () => {
        const count = createSignal(0);
        const name = createSignal(NAMES.IT_INCUBATOR);
        let currentCount;
        let currentName;

        registerEffect(() => {
            currentCount = count();
        });
        registerEffect(() => {
            currentName = name();
        });

        count.set(5);
        expect(currentCount).toBe(5);
        name.set(NAMES.IT_KAMASUTRA)
        expect(currentName).toBe(NAMES.IT_KAMASUTRA);

    });


    it('should correctly compute derived values with computed signals', () => {
        const countSignal = createSignal(2);
        const doubleCountSignal = computed(() => countSignal() * 2);

        expect(countSignal()).toBe(2);
        expect(doubleCountSignal()).toBe(4);

        countSignal.set(3);
        expect(doubleCountSignal()).toBe(6);
    });

    it('should correctly compute derived values with computed signals with effect', () => {
        const countSignal = createSignal(2);
        const doubleCountSignal = computed(() => countSignal() * 2);
        let testValue = null;
        registerEffect( () => {
            testValue = doubleCountSignal();
        })
        expect(testValue).toBe(4)

        countSignal.set(10)
        expect(testValue).toBe(20)
    });

    it('should correctly with effect with 2 independent signals', () => {
        const countSignal = createSignal(2);
        const nameSignal = createSignal(NAMES.IT_INCUBATOR);
        let testCount = null;
        let testName = null;

        registerEffect( () => {
            testCount = countSignal();
            testName = nameSignal();
        })

        expect(testCount).toBe(2)
        expect(testName).toBe(NAMES.IT_INCUBATOR)


        countSignal.set(10)

        expect(testCount).toBe(10)
        expect(testName).toBe(NAMES.IT_INCUBATOR)

        nameSignal.set(NAMES.IT_KAMASUTRA)

        expect(testCount).toBe(10)
        expect(testName).toBe(NAMES.IT_KAMASUTRA)
    });


    it('should correctly with 2 effects', () => {
        const countSignal = createSignal(2);
        let testCount1 = null;
        let testCount2 = null;

        registerEffect( () => {
            testCount1 = countSignal();
        })

        registerEffect( () => {
            testCount2 = countSignal();
        })

        countSignal.set(10);

        expect(testCount1).toBe(10)
        expect(testCount2).toBe(10)

    });

    it('should call effect once after set', () => {
        const effects = {
            effect: () => {
                countSignal();
                countSignal();
            }
        }

        const spy = jest.spyOn(effects, 'effect')

        const countSignal = createSignal(2);

        registerEffect(effects.effect)

        expect(spy).toHaveBeenCalledTimes(1)

        countSignal.set(10)

        expect(spy).toHaveBeenCalledTimes(2)

    });


});
