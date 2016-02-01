describe('Module: ui.tree-filter', function () {
    'use strict';

    let sampleTree, uiTreeFilter;

    beforeEach(module('ui.tree-filter'));

    beforeEach(module(function (uiTreeFilterSettingsProvider) {
        uiTreeFilterSettingsProvider.addresses = ['title', 'stringArray'];
    }));

    beforeEach(function () {
        sampleTree = [
            {
                id: 1,
                title: '1. dragon-breath',
                items: [],
            },
            {
                id: 2,
                title: '2. moire-vision',
                items: [
                    {
                        id: 21,
                        title: '2.1. tofu-animation',
                        stringArray: ['item', 'match-me'],
                        items: [
                            {
                                id: 211,
                                title: '2.1.1. spooky-giraffe',
                                items: [
                                    {
                                        id: 212,
                                        title: '2.1.1.1. bubble-burst',
                                        stringArray: ['item', 'eight', 'another item'],
                                        items: [],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        id: 22,
                        title: '2.2. barehand-atomsplitting',
                        stringArray: ['find-me'],
                        items: [],
                    },
                ],
            },
            {
                id: 3,
                title: '3. unicorn-zapper',
                stringArray: ['lowercase', 'UPPERCASE'],
                items: [],
            },
            {
                id: 4,
                title: '4. romantic-transclusion',
                stringArray: ['one', 'item'],
                items: [],
            },
        ];
    });

    beforeEach(inject(function ($filter) {
        uiTreeFilter = $filter('uiTreeFilter');
    }));

    it('should match item on level 1', function () {
        const matchedString = 'romantic';

        expect(uiTreeFilter(sampleTree[0], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[1], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[1].items[0], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[1].items[0].items[0], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[1].items[0].items[0].items[0], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[1].items[1], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[2], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[3], matchedString)).toBe(true);
    });

    it('should match entire path to the first strict match', function () {
        const matchedString = 'bubble';

        expect(uiTreeFilter(sampleTree[0], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[1], matchedString)).toBe(true);
        expect(uiTreeFilter(sampleTree[1].items[0], matchedString)).toBe(true);
        expect(uiTreeFilter(sampleTree[1].items[0].items[0], matchedString)).toBe(true);
        expect(uiTreeFilter(sampleTree[1].items[0].items[0].items[0], matchedString)).toBe(true);
        expect(uiTreeFilter(sampleTree[1].items[1], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[2], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[3], matchedString)).toBe(false);
    });

    it('should match several items on the same level', function () {
        const matchedString = '-a';

        expect(uiTreeFilter(sampleTree[0], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[1], matchedString)).toBe(true);
        expect(uiTreeFilter(sampleTree[1].items[0], matchedString)).toBe(true);
        expect(uiTreeFilter(sampleTree[1].items[0].items[0], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[1].items[0].items[0].items[0], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[1].items[1], matchedString)).toBe(true);
        expect(uiTreeFilter(sampleTree[2], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[3], matchedString)).toBe(false);
    });

    it('should match case-insensitive', function () {
        const matchedString = 'ZAPPER';

        expect(uiTreeFilter(sampleTree[0], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[1], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[1].items[0], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[1].items[0].items[0], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[1].items[0].items[0].items[0], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[1].items[1], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[2], matchedString)).toBe(true);
        expect(uiTreeFilter(sampleTree[3], matchedString)).toBe(false);
    });

    it('should match regular expression (entire path)', function () {
        // 2.1, 2.1.1, 2.1.1.1 and 2 since it's part of the path, as well as 2.2
        const matchedString = '[0-9]\.[0-9]\..[a-z]';

        expect(uiTreeFilter(sampleTree[0], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[1], matchedString)).toBe(true);
        expect(uiTreeFilter(sampleTree[1].items[0], matchedString)).toBe(true);
        expect(uiTreeFilter(sampleTree[1].items[0].items[0], matchedString)).toBe(true);
        expect(uiTreeFilter(sampleTree[1].items[0].items[0].items[0], matchedString)).toBe(true);
        expect(uiTreeFilter(sampleTree[1].items[1], matchedString)).toBe(true);
        expect(uiTreeFilter(sampleTree[2], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[3], matchedString)).toBe(false);
    });

    it('should match with local configuration', function () {
        sampleTree[0].description = 'some sample description';
        const matchedString = 'sample';

        expect(uiTreeFilter(sampleTree[0], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[0], matchedString, ['title', 'description'])).toBe(true);
    });

    it('should match dot-delimited paths to value', function () {
        sampleTree[0].nested = {
            property: 'nested property value',
        };
        const matchedString = 'nested';

        expect(uiTreeFilter(sampleTree[0], matchedString)).toBe(false);
        expect(uiTreeFilter(sampleTree[0], matchedString, ['title', 'description'])).toBe(false);
        expect(uiTreeFilter(sampleTree[0], matchedString, ['title', 'description', 'nested'])).toBe(false);
        expect(uiTreeFilter(sampleTree[0], matchedString, ['title', 'description', 'nested.property'])).toBe(true);
    });

    it('should support objects that may not have all addresses', function () {
        const matchedString = 'nested';

        inject(function (uiTreeFilterSettings) {
            uiTreeFilterSettings.addresses.push('nonexistent.property');
        });

        expect(function () {
            uiTreeFilter(sampleTree[0], matchedString);
        }).not.toThrow();
    });

    describe('array matching', function () {

        it('should match an array item on level 1', function () {
            const matchedString = 'one';

            expect(uiTreeFilter(sampleTree[0], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[1], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[1].items[0], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[1].items[0].items[0], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[1].items[0].items[0].items[0], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[1].items[1], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[2], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[3], matchedString)).toBe(true);
        });

        it('should match entire path to the first strict array match', function () {
            const matchedString = 'eight';

            expect(uiTreeFilter(sampleTree[0], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[1], matchedString)).toBe(true);
            expect(uiTreeFilter(sampleTree[1].items[0], matchedString)).toBe(true);
            expect(uiTreeFilter(sampleTree[1].items[0].items[0], matchedString)).toBe(true);
            expect(uiTreeFilter(sampleTree[1].items[0].items[0].items[0], matchedString)).toBe(true);
            expect(uiTreeFilter(sampleTree[1].items[1], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[2], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[3], matchedString)).toBe(false);
        });

        it('should match several items on the same level', function () {
            const matchedString = '-me';

            expect(uiTreeFilter(sampleTree[0], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[1], matchedString)).toBe(true);
            expect(uiTreeFilter(sampleTree[1].items[0], matchedString)).toBe(true);
            expect(uiTreeFilter(sampleTree[1].items[0].items[0], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[1].items[0].items[0].items[0], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[1].items[1], matchedString)).toBe(true);
            expect(uiTreeFilter(sampleTree[2], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[3], matchedString)).toBe(false);
        });

        it('should match case-insensitive', function () {
            const matchedString = 'LOWERCASE';

            expect(uiTreeFilter(sampleTree[0], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[1], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[1].items[0], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[1].items[0].items[0], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[1].items[0].items[0].items[0], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[1].items[1], matchedString)).toBe(false);
            expect(uiTreeFilter(sampleTree[2], matchedString)).toBe(true);
            expect(uiTreeFilter(sampleTree[3], matchedString)).toBe(false);
        });

    });
});
