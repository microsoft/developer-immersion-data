(function () {
    'use strict';

    angular.module('expensesApp').factory('appInsights', [
        appInsights
    ]);

    function appInsights() {

        var proxy = window.appInsights || {
            logEvent: function () { console.log('appInsights not defined') },
            logPageView: function () { console.log('appInsights not defined') }
        };

        function logEvent(eventName, stringProperties, intProperties) {
            if (eventName) {
                console.log('appInsights logEvent: ' + eventName)
                proxy.logEvent(
                   eventName,
                   stringProperties,
                   intProperties
                );
            }
        };

        function logPageView(page) {
            if (page) {
                console.log('appInsights logPageView: ' + page)
                proxy.logPageView(page);
            }
        }

        var service = {
            logEvent: logEvent,
            logPageView: logPageView
        };

        return service;

    }
}());
