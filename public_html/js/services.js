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
angular.module('Services', [])
        .factory('serverService', function ($http) {
            function getFilter(filter, filteroperator, filtervalue) {
                var filterParams;
                if (filter) {
                    filterParams = "&filter=" + filter + "&filteroperator=" + filteroperator + "&filtervalue=" + filtervalue;
                } else {
                    filterParams = "";
                }
                return filterParams;
            }
            ;
            function getOrder(order, ordervalue) {
                var orderParams;
                if (order) {
                    orderParams = '&order=' + order + '&ordervalue=' + ordervalue;
                } else {
                    orderParams = "";
                }
                return orderParams;
            }
            ;
            return {
                  ////////////////////////////////////////////////////////////////
                getLoginPromise: function (username, password) {
                    //password = forge_sha256(password).toUpperCase();
                    return $http.get(this.getAppUrl() + '?ob=usuario&op=login&user=' + username + '&pass=' + password, 'GET', '');
                },
                getLogoutPromise: function () {
                    return $http.get(this.getAppUrl() + '?ob=usuario&op=logout', 'GET', '');
                },
                getSessionPromise: function () {
                    return $http.get(this.getAppUrl() + '?ob=usuario&op=getsessionstatus', 'GET', '');
                },
                promise_getCount: function (strObject, filter) {
                    if (filter) {
                        filter = "&filter=" + filter;
                    } else {
                        filter = "";
                    }
                    return $http.get(this.getAppUrl() + '?ob=' + strObject + '&op=getcount' + filter, 'GET', '');
                },
                promise_getPage: function (strObject, rpp, page, filter, order) {
                    if (filter) {
                        filter = "&filter=" + filter;
                    } else {
                        filter = "";
                    }
                    if (order) {
                        order = "&order=" + order;
                    } else {
                        order = "";
                    }
                    return $http.get(this.getAppUrl() + '?ob=' + strObject + '&op=getpage&page=' + page + "&rpp=" + rpp + filter + order, 'GET', '');
                },
                calculatePages: function (regsPerPage, totalRegisters) {
                    var pages = Math.floor(totalRegisters / regsPerPage);
                    var remainderPages = totalRegisters % regsPerPage;
                    if (remainderPages > 0) {
                        pages++;
                    }
                    return pages;
                },
                promise_getOne: function (strClass, id) {
                    return $http.get(this.getAppUrl() + '?ob=' + strClass + '&op=get&id=' + id, 'GET', '');
                },
                promise_removeOne: function (strClass, id) {
                    return $http.get(this.getAppUrl() + '?ob=' + strClass + '&op=remove&id=' + id, 'GET', '');
                },
                promise_setOne: function (strClass, jsonfile) {
                    $http.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';
                    return $http.get(this.getAppUrl() + '?ob=' + strClass + '&op=set', {params: jsonfile});
                },
                ////////////////////////////////////////////////////////////////
                getRangeArray: function (lowEnd, highEnd) {
                    var rangeArray = [];
                    for (var i = lowEnd; i <= highEnd; i++) {
                        rangeArray.push(i);
                    }
                    return rangeArray;
                },
                evaluateMin: function (lowEnd, highEnd) {
                    return Math.min(lowEnd, highEnd);
                },
                evaluateMax: function (lowEnd, highEnd) {
                    return Math.max(lowEnd, highEnd);
                },
                getParamArray: function (parameter) {
                    var newParamArray = [];
                    var newNewParamArray = [];
                    if (typeof (parameter) != "undefined") {
                        if (typeof (parameter) == "string") {
                            newParamArray.push(parameter.split('&'));
                        }
                        for (var i = 0; i < newParamArray[0].length; i++) {
                            newNewParamArray.push(newParamArray[0][i].split(','));
                        }
                    }
                    return newNewParamArray;
                },
                getParamString: function (paramArray) {
                    var newParamStr = "";
                    if (paramArray) {
                        for (var i = 0; i < paramArray.length; i++) {
                            if (i !== 0)
                                newParamStr += "&";
                            for (var j = 0; j < paramArray[i].length; j++) {
                                if (j !== 0)
                                    newParamStr += ",";
                                newParamStr += paramArray[i][j];
                            }
                        }
                    }
                    return newParamStr;
                },
                getUrlFromParams: function (ob, op, numpage, rpp, ufilter, uorder) {
                    var ruta = ob + '/' + op + '/' + numpage + '/' + rpp;
                    ruta += "/" + this.getParamString(ufilter);
                    ruta += "/" + this.getParamString(uorder);
                    return ruta;
                },
                getParamString4AJAX: function (paramArray, paramName) {
                    var newParamStr = "";
                    if (paramArray) {
                        for (var i = 0; i < paramArray.length; i++) {
                            newParamStr += "&" + paramName;
                            //if (paramArray.length > 1) { //siempre array en AJAX
                            newParamStr += "[]";
                            //}
                            newParamStr += "=" + paramArray[i].toString();
                        }
                    }
                    return newParamStr;
                },
                resetCSS: function () {
                    $('link[rel="stylesheet"]').each(function () {
                        this.remove();
                    })
                    $('<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>').appendTo("head");
                    $('<link href="vendor/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet" type="text/css"/>').appendTo("head");
                    $('<link href="vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>').appendTo("head");
                    //these fonts have been located on our server
                    //$('<link href="http://fonts.googleapis.com/css?family=Oswald" rel="stylesheet" type="text/css"/>').appendTo("head");
                    //$('<link href="http://fonts.googleapis.com/css?family=Questrial" rel="stylesheet" type="text/css"/>').appendTo("head");
                    $('<link href="css/main/fonts/fonts.css" rel="stylesheet" type="text/css"/>').appendTo("head");
                    $('<link href="css/main/main.css" rel="stylesheet" type="text/css"/>').appendTo("head");
                },
                date_toDate: function (input) {
                    var parts = input.split('/');
                    return new Date(parts[2], parts[1] - 1, parts[0]);
                },
                date_toDate2: function (input) {
                    var parts = input.split('-');
                    return new Date(parts[0], parts[1] - 1, parts[2]);
                },
//                getAppClientUrl: function () {
//                    return location.protocol + '//' + location.hostname + ':' + location.port + '/' + this.getAppName();
//                },
                getAppUrl: function () {
                    return "http://localhost:8081/zylkanexy/json";
                    //return location.protocol + '//' + location.hostname + ':' + location.port + '/' + this.getAppName() + '/index.php';
                },
                getAppName: function () {
                    var strPath = window.location.pathname;
                    return strPath.substr(1, strPath.substr(1, strPath.length).indexOf('/'));
                },
                old_promise_getOne: function (strClass, id) {
                    return $http.get(this.getAppUrl() + '?ob=' + strClass + '&op=get&id=' + id, 'GET', '');
//                                   return $http({
//                        url: configuration.getAppUrl() + '?ob=' + strClass + '&op=getaggregateviewone&id=' + id,
//                        method: "GET"
//
//                    });
                },
//                patch: function (strParams) {
//                    console.log("patch " + this.getAppUrl() + '?' + strParams);
//                    return $http.patch(this.getAppUrl() + '?' + strParams + '&db=scroom&debug=true&XDEBUG_SESSION_START=netbeans-xdebug#/').then(function (response) {
//                        if (response.status == 200) {
//                            console.log("patch 200");
//                            return response;
//                        } else {
//                            console.log("patch <>200");
//                            return false;
//                        }
//                    },
//                            function errorCallback(response, status) {
//                                console.log("patch error" + status);
//                                return false;
//                            })
//                },
                patch: function (strParams) {
                    console.log("patch " + this.getAppUrl() + '?' + strParams);
                    return $http.get(this.getAppUrl() + '?' + strParams).then(function (response) {
                        if (response.status == 200) {
                            console.log("patch 200");
                            return response;
                        } else {
                            console.log("patch <>200");
                            return false;
                        }
                    },
                            function errorCallback(response, status) {
                                console.log("patch error" + status);
                                return false;
                            })
                },                
                //----------------------
                get: function (strParams) {
                    console.log("get " + this.getAppUrl() + '?' + strParams);
                    return $http.get(this.getAppUrl() + '?' + strParams + '&db=scroom&debug=true&XDEBUG_SESSION_START=netbeans-xdebug#/').then(function (response) {
                        if (response.status == 200) {
                            console.log("get 200");
                            return response;
                        } else {
                            console.log("get <>200");
                            return false;
                        }
                    }, function errorCallback(response, status) {
                        console.log("get error" + status);
                        return false;
                    })
                },
                //----------------------
                put: function (strParams, jsonfile) {
                    $http.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';
                    console.log("put " + this.getAppUrl() + '?' + strParams);
                    return $http.put(this.getAppUrl() + '?' + strParams + '&db=scroom&debug=true&XDEBUG_SESSION_START=netbeans-xdebug#/', jsonfile).then(function (response) {
                        if (response.status == 200) {
                            console.log("put 200");
                            return response;
                        } else {
                            console.log("put <>200");
                            return false;
                        }
                    }, function errorCallback(response, status) {
                        console.log("put error" + status);
                        return false;
                    })
                },
                getNumPages: function (intTotalRegisters, intRegsPerPage) {
                    return (parseInt((intTotalRegisters - 1) / intRegsPerPage)) + 1;
                },
                promise_getMeta: function (strClass) {
                    return $http.get(this.getAppUrl() + '?ob=' + strClass + '&op=getmetainformation', 'GET', '');
                },
                promise_getSome: function (strClass, rpp, page, filterParams, orderParams, systemfilterParams) {
                    return $http.get(this.getAppUrl() + '?ob=' + strClass + '&op=getaggregateviewsome' + '&rpp=' + rpp + '&page=' + page + filterParams + orderParams + systemfilterParams, 'GET', '');
                },
                promise_getAll: function (strClass, filterParams, orderParams, systemfilterParams) {
                    return $http.get(this.getAppUrl() + '?ob=' + strClass + '&op=getaggregateviewall' + filterParams + orderParams + systemfilterParams, 'GET', '');
                },
                old_promise_removeOne: function (strClass, id) {
                    return $http.get(this.getAppUrl() + '?ob=' + strClass + '&op=remove&id=' + id, 'GET', '');
                },
                old_promise_getPromise: function (strClass, operation, params) {
                    return $http.get(this.getAppUrl() + '?ob=' + strClass + '&op=' + operation + params, 'GET', '');
                },
                old_promise_setOne: function (strClass, jsonfile) {
                    $http.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';
                    return $http.get(this.getAppUrl() + '?ob=' + strClass + '&op=set', {params: jsonfile});
                },
//                getDataFromPromise: function (promise) {
//                    return promise.then(function (result) {
//                        return result.data;
//                    });
//                },
//                get: function (objeto, numero) {
//                    return $http.get('/' + this.appName + '/json' + objeto + '/' + numero + '/get.json').then(function (result) {
//                        return result.data;
//                    });
//                },
                getPage: function (objeto, pagina, order, ordervalue, rpp, filter, filteroperator, filtervalue, systemfilter, systemfilteroperator, systemfiltervalue) {
                    var orderParams = getOrder(order, ordervalue);
                    var filterParams = getFilter(filter, filteroperator, filtervalue);
                    var systemfilterParams = getFilter(systemfilter, systemfilteroperator, systemfiltervalue);
                    //console.log('/' + appName + '/' + objeto + '/' + rpp + '/' + pagina + '/getpage.json?' + filterParams + orderParams + systemfilterParams);
                    return $http.get('/' + appName + '/' + objeto + '/' + rpp + '/' + pagina + '/getpage.json?' + filterParams + orderParams + systemfilterParams).then(function (result) {
                        return result.data;
                    });
                },
                getFieldNames: function (objeto) {
                    return $http.get('/' + appName + '/' + objeto + '/getcolumns.json').then(function (result) {
                        return result.data;
                    });
                },
                getPrettyFieldNames: function (objeto) {
                    return $http.get('/' + appName + '/' + objeto + '/getprettycolumns.json').then(function (result) {
                        return result.data;
                    });
                },
                getPages: function (objeto, rpp, filter, filteroperator, filtervalue, systemfilter, systemfilteroperator, systemfiltervalue) {
                    var filterParams = getFilter(filter, filteroperator, filtervalue);
                    var systemfilterParams = getFilter(systemfilter, systemfilteroperator, systemfiltervalue);
                    return $http.get('/' + appName + '/' + objeto + '/' + rpp + '/getpages.json?' + filterParams + systemfilterParams).then(function (result) {
                        return result.data;
                    });
                },
                remove: function (objeto, numero) {
                    return $http.get('/' + appName + '/' + objeto + '/' + numero + '/remove.json').then(function (result) {
                        return result.data;
                    });
                },
                save: function (objeto, datos) {
                    $http.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';
//


                    $http({
                        url: configuration.getAppUrl() + '?ob=' + strClass + '&op=set',
                        method: "GET",
                        params: jsonfile
                    });
                },
                array_identificarArray: function (arr) {
                    var newObj = {};
                    for (var property in arr) {
                        if (arr.hasOwnProperty(property)) {
                            if (property.match("^obj_")) {
                                newObj[property.replace("obj_", "id_")] = arr[property].id;
                            } else {
                                newObj[property] = arr[property];
                            }
                        }
                    }
                    return newObj;
                },
                getPaginationBar: function (objeto, accion, page_number, total_pages, neighborhood, nrpp) {
                    page_number = parseInt(page_number);
                    total_pages = parseInt(total_pages);
                    neighborhood = parseInt(neighborhood);
                    var link = '#/' + objeto + '/' + accion + '/';
                    var vector = "<div class=\"pagination\"><ul>";
                    if (page_number > 1)
                        vector += ("<li><a class=\"pagination_link\" id=\"" + (page_number - 1) + "\" href=\"" + link + (page_number - 1) + "/" + nrpp + "\">prev</a></li>");
                    if (page_number > neighborhood + 1)
                        vector += ("<li><a class=\"pagination_link\" id=\"1\" href=\"" + link + "1/" + nrpp + "\">1</a></li>");
                    if (page_number > neighborhood + 2)
                        vector += ("<li>" + "<a href=\"#\">...</a>" + "</li>");
                    for (var i = (page_number - neighborhood); i <= (page_number + neighborhood); i++) {
                        if (i >= 1 && i <= total_pages) {
                            if (page_number == i) {
                                vector += ("<li class=\"active\"><a class=\"pagination_link\" id=\"" + i + "\" href=\"" + link + i + "/" + nrpp + "\">" + i + "</a></li>");
                            } else
                                vector += ("<li><a class=\"pagination_link\" id=\"" + i + "\" href=\"" + link + i + "/" + nrpp + "\">" + i + "</a></li>");
                        }
                    }
                    if (page_number < total_pages - (neighborhood + 1))
                        vector += ("<li>" + "<a href=\"#\">...</a>" + "</li>");
                    if (page_number < total_pages - (neighborhood))
                        vector += ("<li><a class=\"pagination_link\" id=\"" + total_pages + "\" href=\"" + link + total_pages + "/" + nrpp + "\">" + total_pages + "</a></li>");
                    if (page_number < total_pages)
                        vector += ("<li><a class=\"pagination_link\"  id=\"" + (page_number + 1) + "\" href=\"" + link + (page_number + 1) + "/" + nrpp + "\">next</a></li>");
                    vector += "</ul></div>";
                    return vector;
                },
                getNrppBar: function (objeto, accion, page_number, nrpp) {
                    var link = '#/' + objeto + '/' + accion + '/';
                    var vector = "<div class=\"pagination\"><ul>";
                    if (nrpp == 5)
                        vector += "<li class=\"active\" >";
                    else
                        vector += "<li> ";
                    vector += "<a class=\"nrpp\" id=\"nrrp5\" href=\"" + link + page_number + "/5" + "\">5</a></li>";
                    if (nrpp == 10)
                        vector += "<li class=\"active\" >";
                    else
                        vector += "<li> ";
                    vector += "<a class=\"nrpp\" id=\"nrrp10\" href=\"" + link + page_number + "/10" + "\">10</a></li>";
                    if (nrpp == 20)
                        vector += "<li class=\"active\" >";
                    else
                        vector += "<li> ";
                    vector += "<a class=\"nrpp\" id=\"nrrp20\" href=\"" + link + page_number + "/20" + "\">20</a></li>";
                    if (nrpp == 50)
                        vector += "<li class=\"active\" >";
                    else
                        vector += "<li> ";
                    ;
                    vector += "<a class=\"nrpp\" id=\"nrrp50\" href=\"" + link + page_number + "/50" + "\">50</a></li>";
                    if (nrpp == 100)
                        vector += "<li class=\"active\" >";
                    else
                        vector += "<li> ";
                    vector += "<a class=\"nrpp\" id=\"nrrp100\" href=\"" + link + page_number + "/100" + "\">100</a></li>";
                    // http://localhost:8081/AjaxStockUniDaoSpring/index.jsp#/cliente/4/nrpp
                    vector += "</ul></div>";
                    return vector;
                },
                parameter_printOrderParamsInUrl: function (objParams) {
                    if (objParams)
                        if (objParams.order) {
                            return '&order=' + objParams.order + '&ordervalue=' + objParams.ordervalue;
                        } else {
                            return '';
                        }
                    else
                        return '';
                },
                parameter_printFilterParamsInUrl: function (objParams) {
                    if (objParams)
                        if (objParams.filter) {
                            return "&filter=" + objParams.filter + "&filteroperator=" + objParams.filteroperator + "&filtervalue=" + objParams.filtervalue;
                        } else {
                            return '';
                        }
                    else
                        return '';
                },
                parameter_printSystemFilterParamsInUrl: function (objParams) {
                    if (objParams)
                        if (objParams.systemfilter) {
                            return "&systemfilter=" + objParams.systemfilter + "&systemfilteroperator=" + objParams.systemfilteroperator + "&systemfiltervalue=" + objParams.systemfiltervalue;
                        } else {
                            return '';
                        }
                    else
                        return '';
                }



            };
        })
        .factory('sharedSpaceService', function ($http) {
            var obj = {};
            var link = "";
            var fase = 0;
            return {
                getObject: function () {
                    return obj;
                },
                setObject: function (value) {
                    obj = value;
                },
                getReturnLink: function () {
                    return link;
                },
                setReturnLink: function (value) {
                    link = value;
                },
                getFase: function () {
                    return fase;
                },
                setFase: function (value) {
                    fase = value;
                }

            };
        })
        .factory('sessionService', function ($http) {
            var isSessionActive = false;
            var username = "";
            return {
                getUsername: function () {
                    return username;
                },
                setUsername: function (value) {
                    username = value;
                },
                isSessionActive: function () {
                    return isSessionActive;
                },
                setSessionInactive: function () {
                    isSessionActive = false;
                },
                setSessionActive: function () {
                    isSessionActive = true;
                }

            };
        })
        .value('version', '0.1');
