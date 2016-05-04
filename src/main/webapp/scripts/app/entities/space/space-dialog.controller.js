'use strict';

angular.module('project1App').controller('SpaceDialogController',
    ['$scope', '$stateParams', 'entity', 'Space', 'Service', 'Image', 'Favorite', 'Review', 'Conversation', 'User', 'NgMap', '$state', 'Upload',
        function($scope, $stateParams, entity, Space, Service, Image, Favorite, Review, Conversation, User, NgMap, $state, Upload) {

        $scope.space = entity;
        $scope.services = Service.query();
        $scope.images = Image.query();
        $scope.favorites = Favorite.query();
        $scope.reviews = Review.query();
        $scope.conversations = Conversation.query();
        $scope.users = User.query();
        $scope.archivos = [];
        $scope.load = function(id) {
            Space.get({id : id}, function(result) {
                $scope.space = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('project1App:spaceUpdate', result);
            //$uibModalInstance.close(result);
            for (var i = 0; i < $scope.archivos.length; i++) {
                $scope.upload($scope.archivos[i]);
                Image.save({image: $scope.archivos[i].name, space_id: 1});
            }

            $state.go('space', null, {reload: true});
            $scope.isSaving = false;
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.space.lat = $scope.lat;
            $scope.space.lng = $scope.lng;
            $scope.isSaving = true;
            if ($scope.space.id != null) {
                Space.update($scope.space, onSaveSuccess, onSaveError);
            } else {
                Space.save($scope.space, onSaveSuccess, onSaveError);
            }

        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        var vm = this;
        NgMap.getMap({id: 'foomap'}).then(function(map) {
            vm.map = map;
        });


        $scope.lat = [];
        $scope.lng = [];
        vm.placeChanged = function() {
            vm.place = this.getPlace();
            vm.map.setCenter(vm.place.geometry.location);
            $scope.lat = vm.place.geometry.location.lat();
            $scope.lng = vm.place.geometry.location.lng();
        }


            $scope.submit = function() {
                    $scope.upload($scope.file);
            };

            $scope.upload = function (file) {
                console.log(file);
                Upload.upload({
                    url: 'api/upload',
                    data: {file: file, 'name': file.name}
                }).then(function (resp) {
                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            };

            $scope.$watch('file', function () {
                if ($scope.file != null) {
                     $scope.archivos.push($scope.file);
                }
            });


/*
            $scope.artworkShow = function (e) {
                console.log(e);
                $scope.artworkFile = e;
                var reader = new FileReader();
                reader.onload = function (e) {
                    var image;
                    image = new Image();
                    image.src = e.target.result;
                    return image.onload = function () {
                        return $('.artwork__holder').attr("src", this.src);
                    };
                };
                return reader.readAsDataURL(e);
            }
*/




        }]);
