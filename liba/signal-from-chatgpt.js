let activeEffect = null; // Make activeEffect globally accessible

// Signal function
function signal(initialValue) {
    let value = initialValue;
    const subscribers = new Set();

    const getter = () => {
        if (activeEffect) {
            // Track the effect as a subscriber to this signal
            subscribers.add(activeEffect);
        }
        return value;
    };

    getter.set = (newValue) => {
        if (value !== newValue) {
            value = newValue;
            subscribers.forEach((fn) => fn());
        }
    };

    getter.update = (updater) => {
        const newValue = updater(value);
        getter.set(newValue);
    };

    return getter;
}

// Effect function
function effect(fn) {
    const runEffect = () => {
        cleanup(); // Cleanup previous subscriptions
        activeEffect = runEffect; // Track the current effect
        fn(); // Execute the effect
        activeEffect = null; // Reset after execution
    };

    const cleanupFns = [];

    const cleanup = () => {
        cleanupFns.forEach((cleanupFn) => cleanupFn());
        cleanupFns.length = 0;
    };

    runEffect(); // Run effect immediately

    return () => cleanup(); // Optionally provide cleanup function
}

// Computed signal function
function computed(fn) {
    let cachedValue;
    let needsUpdate = true;

    const getter = () => {
        if (needsUpdate) {
            cachedValue = fn();
            needsUpdate = false;
        }
        if (activeEffect) {
            // Track the effect as a subscriber to this computed signal
            effect(() => {
                needsUpdate = true;
            });
        }
        return cachedValue;
    };

    return getter;
}

// Usage example:

const count = signal(0);

effect(() => {
    console.log(`The current count is: ${count()}`);
});

// Updating the count
count.set(1); // Effect will rerun and print "The current count is: 1"
count.update(value => value + 1); // Effect will rerun and print "The current count is: 2"

const doubleCount = computed(() => count() * 2);

effect(() => {
    console.log(`The current doubleCount is: ${doubleCount()}`);
});
console.log('register effect')

count.set(10);
