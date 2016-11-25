/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';

moduloProducto.controller('ProductoPListController', ['$scope', '$routeParams', 'serverService', '$location', '$uibModal',
    function ($scope, $routeParams, serverService, $location, $uibModal) {

        $scope.Fields = [
            {name: "id", shortname: "ID", longname: "Identificador", visible: true, type: "integer"},
            {name: "nombre", shortname: "Nombre", longname: "Nombre", visible: true, type: "string"},
            {name: "cantidad", shortname: "Cantidad", longname: "Cantidad", visible: true, type: "integer"},
        ];

        $scope.ob = "producto";
        $scope.op = "plist";
        $scope.title = "Listado de productos";
        $scope.icon = "fa-file-text-o";

        $scope.numpage = $routeParams.page;
        $scope.rpp = $routeParams.rpp;
        $scope.neighbourhood = 2;
        
        if (!$routeParams.page || $routeParams.page < 1) {
            $scope.numpage = 1;
        } else {
            $scope.numpage = $routeParams.page;
        }

        if (!$routeParams.rpp || $routeParams.rpp < 1) {
            $scope.rpp = 10;
        } else {
            $scope.rpp = $routeParams.rpp;
        }

        $scope.order = "";
        $scope.ordervalue = "";

        $scope.filter = "id";
        $scope.filteroperator = "like";
        $scope.filtervalue = "";

        if ($routeParams.filter) {
            $scope.filterParams = $routeParams.filter;
        } else {
            $scope.filterParams = null;
        }

        if ($routeParams.order) {
            $scope.orderParams = $routeParams.order;
        } else {
            $scope.orderParams = null;
        }

        if ($routeParams.sfilter) {
            $scope.sfilterParams = $routeParams.sfilter;
        } else {
            $scope.sfilterParams = null;
        }

        if ($routeParams.sfilter) {
            $scope.filterExpression = $routeParams.filter + '+' + $routeParams.sfilter;
        } else {
            $scope.filterExpression = $routeParams.filter;
        }

        serverService.promise_getCount($scope.ob, $scope.filterExpression).then(function (response) {
            if (response.status == 200) {
                $scope.registers = response.data.message;
                $scope.pages = serverService.calculatePages($scope.rpp, $scope.registers);
                if ($scope.numpage > $scope.pages) {
                    $scope.numpage = $scope.pages;
                }
                return serverService.promise_getPage($scope.ob, $scope.rpp, $scope.numpage, $scope.filterExpression, $routeParams.order);
            } else {
                $scope.status = "Error en la recepción de datos del servidor";
            }
        }).then(function (response) {
            if (response.status == 200) {
                $scope.page = response.data.message;
                $scope.status = "";
            } else {
                $scope.status = "Error en la recepción de datos del servidor";
            }
        }).catch(function (data) {
            $scope.status = "Error en la recepción de datos del servidor";
        });
        
         }]);