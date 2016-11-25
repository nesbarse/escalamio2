/* 
 * Copyright (c) 2015 by Rafael Angel Aznar Aparici (rafaaznar at gmail dot com)
 * 
 * escalamio: The stunning micro-library that helps you to develop easily 
 *             AJAX web applications by using Angular.js 1.x & zylkanexy
 * escalamio is distributed under the MIT License (MIT)
 * Sources at https://github.com/rafaelaznar/
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */

'use strict';
moduloDocumento.controller('DocumentoNewController', ['$scope', '$routeParams', '$location', 'serverService', 'sharedSpaceService', '$filter', '$uibModal',
    function ($scope, $routeParams, $location, serverService, sharedSpaceService, $filter, $uibModal) {

        $scope.ob = 'documento';
        $scope.op = 'new';

        $scope.title = "Edicion de documento";
        $scope.icon = "fa-file-text-o";

        $scope.result = null;

        $scope.obj = {};
        $scope.obj.obj_tipodocumento = {"id": 0};
        $scope.obj.obj_usuario = {"id": 0};


        if ($routeParams.id_usuario) {
            serverService.promise_getOne('usuario', $routeParams.id_usuario).then(function (response) {
                if (response.data.message.id != 0) {
                    $scope.obj.obj_usuario = response.data.message;
                    $scope.show_obj_usuario = false;
                    $scope.title = "Nuevo documento del usuario " + $scope.obj.obj_usuario.nombre + ' ' + $scope.obj.obj_usuario.apellidos;
                }
            });
        } else {
            $scope.show_obj_usuario = true;
        }



        $scope.save = function () {
            var dateAltaAsString = $filter('date')($scope.obj.alta, "dd/MM/yyyy");
            var dateCambioAsString = $filter('date')($scope.obj.cambio, "dd/MM/yyyy");
            $scope.obj.alta = dateAltaAsString;
            $scope.obj.cambio = dateCambioAsString;
            var jsonToSend = {json: JSON.stringify(serverService.array_identificarArray($scope.obj))};
            serverService.promise_setOne($scope.ob, jsonToSend).then(function (data) {
                $scope.result = data.data;
            });
        };

        $scope.$watch('obj.obj_tipodocumento.id', function () {
            if ($scope.obj) {
                serverService.promise_getOne('tipodocumento', $scope.obj.obj_tipodocumento.id).then(function (response) {
                    var old_id = $scope.obj.obj_tipodocumento.id;
                    $scope.obj.obj_tipodocumento = response.data.message;
                    if (response.data.message.id != 0) {
                        $scope.outerForm.obj_tipodocumento.$setValidity('exists', true);
                    } else {
                        $scope.outerForm.obj_tipodocumento.$setValidity('exists', false);
                        $scope.obj.obj_tipodocumento.id = old_id;
                    }
                });
            }
        });

        $scope.$watch('obj.obj_usuario.id', function () {
            if ($scope.obj) {
                serverService.promise_getOne('usuario', $scope.obj.obj_usuario.id).then(function (response) {
                    var old_id = $scope.obj.obj_usuario.id;
                    $scope.obj.obj_usuario = response.data.message;
                    if (response.data.message.id != 0) {
                        $scope.outerForm.obj_usuario.$setValidity('exists', true);
                    } else {
                        $scope.outerForm.obj_usuario.$setValidity('exists', false);
                        $scope.obj.obj_usuario.id = old_id;
                    }
                });
            }
        });

        $scope.back = function () {
            window.history.back();
        };
        $scope.close = function () {
            $location.path('/home');
        };
        $scope.plist = function () {
            $location.path('/documento/plist');
        };

        //datepicker 1
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.popup1 = {
            opened: false
        };
        $scope.dateOptions1 = {
            formatYear: 'yyyy',
            startingDay: 1
        };

        //datepicker 2
        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };
        $scope.popup2 = {
            opened: false
        };
        $scope.dateOptions2 = {
            formatYear: 'yyyy',
            startingDay: 1
        };

        $scope.chooseOne = function (foreignObjectName, contollerName) {
            var modalInstance = $uibModal.open({
                templateUrl: 'js/' + foreignObjectName + '/selection.html',
                controller: contollerName,
                size: 'lg'
            }).result.then(function (modalResult) {
                $scope.obj.obj_usuario.id = modalResult;
            });
        };



    }]);