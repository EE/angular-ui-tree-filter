(function (angular) {
    'use strict';

    angular.module('ui.tree-filter', [])
    /**
     * @ngdoc object
     * @name ui.tree-filter.provider:uiTreeFilterSettings
     */
        .provider('uiTreeFilterSettings', function () {

            var uiTreeFilterSettings = this;

            /**
             * Compares string value to provided pattern using global, case-insensitive regular expression.
             *
             * @param value
             * @param {string} pattern valid regexp pattern.
             * @returns {boolean}
             */
            function regExpStringComparator(value, pattern) {
                return typeof value === 'string' ? !!value.match(new RegExp(pattern, 'gi')) : false;
            }

            var comparators = {
                string: regExpStringComparator,
            };
            this.addresses = ['title'];
            this.descendantCollection = 'items';

            this.setComparator = function (type, callback) {
                comparators[type] = callback;
            };

            this.$get = function () {
                return {
                    addresses: uiTreeFilterSettings.addresses,
                    regexFlags: uiTreeFilterSettings.regexFlags,
                    descendantCollection: uiTreeFilterSettings.descendantCollection,
                    comparators: comparators,
                };
            };
        })
    /**
     * @ngdoc function
     * @name project.factory:projectWbsFilter
     */
        .filter('uiTreeFilter', ["uiTreeFilterSettings", function (uiTreeFilterSettings) {
            /**
             * Iterates through given collection if flag is not true and sets a flag to true on first match.
             *
             * @param {Array}  collection
             * @param {string} pattern
             * @param {string} address - property name or dot-delimited path to property.
             * @param {string} type - which comparator should be used.
             *
             * @returns {boolean}
             */
            function visit(collection, pattern, address, type) {
                return (collection || []).reduce(function (found, node) {
                    return found || check(node, pattern, address, type);
                }, false);
            }

            /**
             * Resolves object value from dot-delimited address.
             *
             * @param address
             * @param object
             * @returns {*}
             */
            function resolve(address, object) {
                var parts = address.split('.');
                return parts.length < 2 ? object[parts[0]] : resolve(parts.slice(1).join('.'), object[parts[0]]);
            }

            /**
             * Checks if object or its children matches a pattern on a given field
             *
             * First it resolves the property address and gets the value, which is passed to the appropriate type
             * comparator function.
             * If item matches because its property matches it's children are not checked.
             * Otherwise all item descendants are checked as well.
             *
             * @param {Object} item
             * @param {string} pattern
             * @param {string} address - property name or dot-delimited path to property.
             * @param {string} type - which comparator should be used.
             *
             * @returns {boolean}
             */
            function check(item, pattern, address, type) {
                return uiTreeFilterSettings.comparators[type](resolve(address, item), pattern) ||
                    visit(item[uiTreeFilterSettings.descendantCollection], pattern, address, type);
            }

            /**
             * Checks if pattern matches any of addresses.
             * Addresses may be defined both as strings nad as objects.
             * If no addresses are passed to the filter function directly, addresses collection form
             * `uiTreeFilterSettings` is used.
             *
             * @param {object} item
             * @param {string} pattern
             *
             * @returns {boolean}
             */
            return function (item, pattern, addresses) {
                return pattern === undefined ||
                    (addresses || uiTreeFilterSettings.addresses).reduce(function (found, address) {
                        return found || check(item, pattern, address.path || address, address.type || 'string');
                    }, false);
            };
        }]);
})(angular);
