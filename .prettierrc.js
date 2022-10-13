module.exports = {
    trailingComma: 'all',
    printWidth: 100,
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    overrides: [
        {
            files: '*.md',
            options: {
                tabWidth: 2,
            },
        },
        {
            files: '*.yml',
            options: {
                tabWidth: 2,
            },
        },
    ],
};
