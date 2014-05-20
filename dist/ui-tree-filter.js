(function (angular) {
    'use strict';

    angular.module('ui.tree-filter', [])
    /**
     * @ngdoc object
     * @name ui.tree-filter.provider:uiTreeFilterSettings
     */
        .provider('uiTreeFilterSettings', function () {

            var uiTreeFilterSettings = this;

            this.supportedFields = ['title'];
            this.regexFlags = 'gi';
            this.descendantCollectionField = 'items';

            this.$get = function () {
                return {
                    supportedFields: uiTreeFilterSettings.supportedFields,
                    regexFlags: uiTreeFilterSettings.regexFlags,
                    descendantCollectionField: uiTreeFilterSettings.descendantCollectionField,
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
             * @param {Array}   collection
             * @param {string}  fieldName
             * @param {string}  pattern
             * @param {boolean} flag
             * @returns {boolean}
             */
            function visit(collection, pattern, fieldName, flag) {
                flag = flag || false;
                if (!flag && collection) {
                    collection.forEach(function (collectionItem) {
                        flag = flag ? true : testForField(collectionItem, fieldName, pattern);
                    });
                }
                return flag;
            }

            /**
             * Checks if object or its children matches a pattern on a given field
             *
             * @param {object} item
             * @param {string} pattern
             * @param {string} fieldName
             *
             * @returns {boolean}
             */
            function testForField(item, pattern, fieldName) {
                var foundInField = item[fieldName] ?
                    !!item[fieldName].match(new RegExp(pattern, uiTreeFilterSettings.regexFlags)) :
                    false;

                return visit(item[uiTreeFilterSettings.descendantCollectionField], fieldName, pattern, foundInField);
            }

            /**
             * Checks if pattern matches any of supported fields
             *
             * @param {object} item
             * @param {string} pattern
             *
             * @returns {boolean}
             */
            return function (item, pattern, supportedFields) {
                supportedFields = supportedFields || uiTreeFilterSettings.supportedFields;
                return supportedFields.reduce(function (foundInAnyField, fieldName) {
                    return foundInAnyField ? true : testForField(item, pattern, fieldName);
                }, false);
            };
        }]);
})(angular);
