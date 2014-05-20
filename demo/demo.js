(function (angular) {
    'use strict';

    angular.module('demoApp', [
        'ui.tree',
        'ui.tree-filter',
        'ui.highlight'
    ])
        .controller('MainCtrl', function ($filter, $scope) {
            $scope.treeFilter = $filter('uiTreeFilter');

            $scope.availableFields = ['title', 'description'];
            $scope.supportedFields = ['title', 'description'];

            $scope.list = [
                {
                    id: 1,
                    title: '1. dragon-breath',
                    description: 'lorem ipsum dolor sit amet',
                    items: []
                },
                {
                    id: 2,
                    title: '2. moiré-vision',
                    description: 'Ut tempus magna id nibh',
                    items: [
                        {
                            id: 21,
                            title: '2.1. tofu-animation',
                            description: 'Sed nec diam laoreet, aliquam',
                            items: [
                                {
                                    id: 211,
                                    title: '2.1.1. spooky-giraffe',
                                    description: 'In vel imperdiet justo. Ut',
                                    items: []
                                },
                                {
                                    id: 212,
                                    title: '2.1.2. bubble-burst',
                                    description: 'Maecenas sodales a ante at',
                                    items: []
                                }
                            ]
                        },
                        {
                            id: 22,
                            title: '2.2. barehand-atomsplitting',
                            description: 'Fusce ut tellus posuere sapien',
                            items: []
                        }
                    ]
                },
                {
                    id: 3,
                    title: '3. unicorn-zapper',
                    description: 'Integer ullamcorper nibh eu ipsum',
                    items: []
                },
                {
                    id: 4,
                    title: '4. romantic-transclusion',
                    description: 'Nullam luctus velit eget enim',
                    items: []
                }
            ];

            $scope.toggleSupport = function (propertyName) {
                return $scope.supportedFields.indexOf(propertyName) > -1 ?
                    $scope.supportedFields.splice($scope.supportedFields.indexOf(propertyName), 1) :
                    $scope.supportedFields.push(propertyName);
            };
        })
    /**
     * Ad-hoc $sce trusting to be used with ng-bind-html
     */
        .filter('trust', function ($sce) {
            return function (val) {
                return $sce.trustAsHtml(val);
            };
        });
})(angular);
