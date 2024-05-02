module.exports = {
    extension: ['.test.ts'],
    loader: 'ts-node/esm',
    reporter: 'spec',
    recursive: true,
    spec: ['src'],
};
