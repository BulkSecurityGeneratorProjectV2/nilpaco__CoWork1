'use strict';

angular.module('project1App')
    .controller('SettingsController', function ($scope, Principal, Auth, Language, $translate, Review) {
        $scope.success = null;
        $scope.error = null;
        Principal.identity().then(function(account) {
            $scope.settingsAccount = copyAccount(account);
        });

        $scope.save = function () {
            Auth.updateAccount($scope.settingsAccount).then(function() {
                $scope.error = null;
                $scope.success = 'OK';
                Principal.identity(true).then(function(account) {
                    $scope.settingsAccount = copyAccount(account);
                });
                Language.getCurrent().then(function(current) {
                    if ($scope.settingsAccount.langKey !== current) {
                        $translate.use($scope.settingsAccount.langKey);
                    }
                });
            }).catch(function() {
                $scope.success = null;
                $scope.error = 'ERROR';
            });
        };

        /**
         * Store the "settings account" in a separate variable, and not in the shared "account" variable.
         */
        var copyAccount = function (account) {
            return {
                activated: account.activated,
                email: account.email,
                firstName: account.firstName,
                langKey: account.langKey,
                lastName: account.lastName,
                login: account.login
            }
        }

        $scope.reviews = [];
        $scope.loadAll = function() {
            Review.query(function(result) {
                $scope.reviews = result;
            });
        };
        $scope.loadAll();

        $scope.reviewsBySpace = [];
        $scope.loadAllBySpace = function() {
            Review.reviewBySpace(function(result) {
                $scope.reviewsBySpace = result;
            });
        };
        $scope.loadAllBySpace();

        $scope.onClickMarker = function (review){
            $scope.selectedReview = review;
        };

    });
