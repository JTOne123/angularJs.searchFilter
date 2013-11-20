angular
    .module('gdnui')
    .directive('searchfilter', function ($compile, $timeout, $q, config, AuthService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                items: '=',
                initFilter: '=',
                filterPath: '@',
                searchAction: '&'
            },
            transclude: true,
            templateUrl: 'templates/components/searchFilter.html',
            link: function (scope, element, attrs) {
                scope.filter = {};

                scope.addFilter = function () {
                    scope.filter[scope.selectedItem.name] = scope.selectedItem.searchVal;
                    scope.wrapFilter[scope.selectedItem.name] = scope.selectedItem;
                    scope.selectedItem = null;
                };

                scope.select = function (selectedItem) {
                    scope.selectedItem = selectedItem;

                    if (scope.selectedItem.values)
                        $q.when(scope.selectedItem.values).then(function (values) {
                            var key = _.keys(values)[0];
                            scope.selectedItem.searchVal = values[key];
                            scope.selectedItem.displayVal = key;
                        });
                };

                scope.removeFilterItem = function (f) {
                    delete scope.filter[f.name];
                    delete scope.wrapFilter[f.name];
                };

                scope.isEmpty = function (obj) {
                    return _.isEmpty(obj);
                };

                scope.isLast = function (obj, list) {
                    var l = _.last(_.toArray(list));
                    return _.isEqual(obj, l);
                };

                scope.displayValue = function (val) {
                    if (_.isObject(val)) {
                        var result = '';

                        if (val._from)
                            result += 'from: ' + val._from + ' ';

                        if (val._to)
                            result += 'to: ' + val._to;

                        if (val.field && val.direction)
                            result += val.field + ' ' + val.direction.toUpperCase();

                        return result;
                    } else {
                        return val;
                    }
                };

                scope.doSearch = function () {
                    if (scope.selectedItem && scope.selectedItem.name && scope.selectedItem.searchVal)
                        scope.addFilter();

                    scope.searchAction && (scope.searchAction())(scope.filter);
                };

                scope.init = function () {
                    scope.availableItems = scope.items;
                    scope.wrapFilter = {};
                    scope.authService = AuthService;

                    if (scope.availableItems.length > 0)
                        scope.select(scope.availableItems[0]);

                    angular
                        .element('.datePicker')
                        .datepicker({ format: config.dateFormat })
                        .on('changeDate', function (ev) {

                            var model = angular.element(ev.target).attr('ng-model');
                            var splitedModel = model.split('.');

                            var selectedDate = ev.date;
                            if (splitedModel[splitedModel.length - 1] == '_to')
                                selectedDate = new Date(selectedDate.setSeconds(24 * 60 * 60 - 1));

                            splitedModel[splitedModel.length - 1] = '_$specialValue' + splitedModel[splitedModel.length - 1];
                            var specialModel = splitedModel.join('.');

                            scope.$eval(
                                model + '="' + angular.element(ev.target).val() + '";' +
                                specialModel + '="' + selectedDate.toISOString() + '";'
                            );

                            scope.$digest();
                        });

                    if (scope.initFilter) {
                        _.each(scope.initFilter, function (val, key) {

                            scope.selectedItem = _.find(scope.items, function (f) {
                                return f.name == key;
                            });

                            if (scope.selectedItem) {
                                scope.selectedItem.searchVal = val;
                                scope.addFilter();
                            }
                        });
                    }
                };

                $timeout(function () {
                    scope.init();
                });
            }
        };
    });