/*
 * Copyright (c) 2015 by Rafael Angel Aznar Aparici (rafaaznar at gmail dot com)
 * 
 * escalamio: The stunning micro-library that helps you to develop easily 
 *             AJAX web applications by using Angular.js 1.x & zylkanexy
 * escalamio is distributed under the MIT License (MIT)
 * Sources at https://github.com/rafaelaznar/escalamio
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
 */

'use strict';

//var appName = 'AjaxStockNg';



var escalamio = angular.module('myApp', [
    'ngRoute',
    'Filters',
    'Services',
    'Directives',
    'systemControllers',
    'documentoControllers',
    'usuarioControllers',
    'tipodocumentoControllers',
    'tipousuarioControllers',
    'estadoControllers',
    'ui.bootstrap',
    'ngSanitize'
]);



//escalamio.config(['$locationProvider', function ($locationProvider) {
//        $locationProvider.html5Mode(true);
//    }]);

escalamio.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }]);

escalamio.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'js/system/home.html', controller: 'HomeController'});
        //------------
        $routeProvider.when('/login', {templateUrl: 'js/system/login.html', controller: 'LoginController'});
        $routeProvider.when('/logout', {templateUrl: 'js/system/logout.html', controller: 'LogoutController'});
        $routeProvider.when('/home', {templateUrl: 'js/system/home.html', controller: 'HomeController'});
        $routeProvider.when('/license', {templateUrl: 'js/system/license.html', controller: 'LicenseController'});
        //------------
        $routeProvider.when('/documento/view/:id', {templateUrl: 'js/documento/view.html', controller: 'DocumentoViewController'});
        $routeProvider.when('/documento/new', {templateUrl: 'js/documento/newedit.html', controller: 'DocumentoNewController'});
        $routeProvider.when('/documento/edit/:id', {templateUrl: 'js/documento/newedit.html', controller: 'DocumentoEditController'});
        $routeProvider.when('/documento/remove/:id', {templateUrl: 'js/documento/remove.html', controller: 'DocumentoRemoveController'});
        $routeProvider.when('/documento/plist/:page?/:rpp?', {templateUrl: 'js/documento/plist.html', controller: 'DocumentoPListController'});
        //------------
        $routeProvider.when('/usuario/view/:id', {templateUrl: 'js/usuario/view.html', controller: 'UsuarioViewController'});
        $routeProvider.when('/usuario/new/:id?', {templateUrl: 'js/usuario/newedit.html', controller: 'UsuarioNewController'});
        $routeProvider.when('/usuario/edit/:id', {templateUrl: 'js/usuario/newedit.html', controller: 'UsuarioEditController'});
        $routeProvider.when('/usuario/remove/:id', {templateUrl: 'js/usuario/remove.html', controller: 'UsuarioRemoveController'});
        $routeProvider.when('/usuario/plist/:page?/:rpp?', {templateUrl: 'js/usuario/plist.html', controller: 'UsuarioPListController'});
        $routeProvider.when('/usuario/selection/:page?/:rpp?', {templateUrl: 'js/tipousuario/selection.html', controller: 'UsuarioSelectionController'});
        //------------
        $routeProvider.when('/tipodocumento/view/:id', {templateUrl: 'js/tipodocumento/view.html', controller: 'TipodocumentoViewController'});
        $routeProvider.when('/tipodocumento/selection/:page?/:rpp?', {templateUrl: 'js/tipodocumento/selection.html', controller: 'TipodocumentoSelectionController'});
        //------------
        $routeProvider.when('/tipousuario/selection/:page?/:rpp?', {templateUrl: 'js/tipousuario/selection.html', controller: 'TipousuarioSelectionController'});
        $routeProvider.when('/tipousuario/view/:id', {templateUrl: 'js/tipousuario/view.html', controller: 'TipousuarioViewController'});
        //------------
        $routeProvider.when('/estado/selection/:page?/:rpp?', {templateUrl: 'js/estado/selection.html', controller: 'EstadoSelectionController'});
        $routeProvider.when('/estado/view/:id', {templateUrl: 'js/estado/view.html', controller: 'EstadoViewController'});
        //------------
        $routeProvider.otherwise({redirectTo: '/'});


    }]);


escalamio.run(function ($rootScope, $location, serverService, sessionService) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
     sessionService.setSessionInactive();
        sessionService.setUsername('');
        serverService.getSessionPromise().then(function (response) {
            if (response['status'] == 200) {
                sessionService.setSessionActive();
                sessionService.setUsername(response.data.message);
            } else {
                sessionService.setSessionInactive();
                sessionService.setUsername('');
                var nextUrl = next.$$route.originalPath;
                if (nextUrl == '/home' || nextUrl == '/login' || nextUrl == '/license') {

                } else {
                    $location.path("/login");
                }
            }            
        }).catch(function (data) {
            sessionService.setSessionInactive();
            sessionService.setUsername('');
             var nextUrl = next.$$route.originalPath;
             if (nextUrl == '/home' || nextUrl == '/login' || nextUrl == '/license') {

             } else {
                 $location.path("/login");
             }
        });
    });
});

var moduloSistema = angular.module('systemControllers', []);
var moduloUsuario = angular.module('usuarioControllers', []);
var moduloDocumento = angular.module('documentoControllers', []);
var moduloTipodocumento = angular.module('tipodocumentoControllers', []);
var moduloTipousuario = angular.module('tipousuarioControllers', []);
var moduloEstado = angular.module('estadoControllers', []);

var moduloDirectivas = angular.module('Directives', []);
