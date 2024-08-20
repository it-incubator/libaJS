// signals.test.js
import { createSignal, registerEffect, computed } from './createSignal.js';

const NAMES = {
    IT_INCUBATOR: 'it-incubator',
    IT_KAMASUTRA: 'it-kamasutra'
}

describe('Signals and effects', () => {
    it('should wait timeout', (done) => {
        const obj = {do: () => {}}
        const spy = jest.spyOn(obj, 'do')

        setTimeout(() => {
            obj.do()
            expect(spy).toHaveBeenCalled()
            done()
        }, 4000)
    })


    it('should update and react to changes in signal', (done) => {
        const countSignal = createSignal(0);
        let testCountValue = null;

        registerEffect(() => {
            const countValue = countSignal();
            testCountValue = countValue
            expect(testCountValue).toBe(countValue);
            done();
        });

        expect(testCountValue).toBe(null);
    });

    it('should async run after set', (done) => {
        const countSignal = createSignal(0);
        let callsCount = 0;

        registerEffect(() => {
            callsCount++;
            countSignal();
            if (callsCount === 2) {
                done();
            }
        });

        expect(callsCount).toBe(0);

        setTimeout(() => {
            countSignal.set(10)
            expect(callsCount).toBe(1);
        }, 1000)
    });




});
