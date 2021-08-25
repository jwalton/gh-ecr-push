const assert = require('assert');
const { getImagesToPush } = require('./images.js');

const tests = [
    {
        test: 'should push an image',
        fn: () => {
            const images = getImagesToPush('local:15.16.17', 'remote:15.16.17', false);

            assert.deepStrictEqual(images, [
                { localImage: 'local:15.16.17', remoteImage: 'remote:15.16.17' },
            ]);
        },
    },
    {
        test: 'should generate semver style images',
        fn: () => {
            const images = getImagesToPush('local:15.16.17', 'remote:15.16.17', true);

            assert.deepStrictEqual(images, [
                { localImage: 'local:15.16.17', remoteImage: 'remote:15' },
                { localImage: 'local:15.16.17', remoteImage: 'remote:15.16' },
                { localImage: 'local:15.16.17', remoteImage: 'remote:15.16.17' },
            ]);
        },
    },
    {
        test: 'should generate semver style images with a v prefix',
        fn: () => {
            const images = getImagesToPush('local:v15.16.17', 'remote:v15.16.17', true);

            assert.deepStrictEqual(images, [
                { localImage: 'local:v15.16.17', remoteImage: 'remote:v15' },
                { localImage: 'local:v15.16.17', remoteImage: 'remote:v15.16' },
                { localImage: 'local:v15.16.17', remoteImage: 'remote:v15.16.17' },
            ]);
        },
    },
    {
        test: 'should generate multiple images',
        fn: () => {
            const images = getImagesToPush('local:15.16.17', 'remote:15.16.17, remote:latest', false);

            assert.deepStrictEqual(images, [
                { localImage: 'local:15.16.17', remoteImage: 'remote:15.16.17' },
                { localImage: 'local:15.16.17', remoteImage: 'remote:latest' },
            ]);
        },
    },
    {
        test: 'should generate multiple semver images',
        fn: () => {
            const images = getImagesToPush('local:15.16.17', 'remote:15.16.17, remote2:latest', true);

            assert.deepStrictEqual(images, [
                { localImage: 'local:15.16.17', remoteImage: 'remote:15' },
                { localImage: 'local:15.16.17', remoteImage: 'remote:15.16' },
                { localImage: 'local:15.16.17', remoteImage: 'remote:15.16.17' },
                { localImage: 'local:15.16.17', remoteImage: 'remote2:15' },
                { localImage: 'local:15.16.17', remoteImage: 'remote2:15.16' },
                { localImage: 'local:15.16.17', remoteImage: 'remote2:15.16.17' },
            ]);
        },
    },
];

async function runTests() {
    let failures = 0;
    for (const { test, fn } of tests) {
        try {
            await fn();
            console.log(`✅ ${test}`);
        } catch (err) {
            failures++;
            console.error(`❌ ${test}`);
            console.error(err.stack);
        }
    }
    return failures;
}

runTests()
    .then((failures) => {
        if (failures > 0) {
            process.exit(1);
        }
    })
    .catch((err) => {
        console.error(err.stack);
        process.exit(1);
    });
