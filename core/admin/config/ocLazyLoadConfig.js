/**
 * Created by zeev on 2016/7/20 0020.
 */
"use strict";
angular.module('app.config')
    .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
        var libsPath = "/libs/";
        var bower = "/bower_components/"
        $ocLazyLoadProvider.config({
            debug: false,
            events: false, //--加载module的事件冒泡--
            modules: [{
                name: 'akoenig.deckgrid',
                files: [bower + "angular-deckgrid/angular-deckgrid.js", libsPath + 'css/deckgrid.css']
            }, {
                name: 'd3',
                files: [bower + "d3/d3.js"]
            }, {
                name: 'cttv',
                files: [libsPath + "cttv.genome.css", bower + "d3/d3.js", libsPath + "cttv.genome.js"]
            }, {
                name: 'summernote',
                files: [bower + "bootstrap/dist/js/bootstrap.js", bower + "summernote/dist/summernote.js", bower + "summernote/dist/summernote.css", bower + "angular-summernote/dist/angular-summernote.js"]
            }, {
                name: 'tree',
                files: [bower + "angular-ui-tree/dist/angular-ui-tree.css", bower + "angular-ui-tree/dist/angular-ui-tree.js"]
            }]
        });
    }])
