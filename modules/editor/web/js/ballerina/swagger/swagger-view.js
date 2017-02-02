/**
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
define(['log', 'lodash', 'jquery', 'event_channel', './api-design'],
    function(log, _, $, EventChannel, APIDesigner) {

    /**
     * @class SwaggerView
     * @augments EventChannel
     * @constructor
     * @class SwaggerView  Wraps the Ace editor for swagger view
     * @param {Object} args - Rendering args for the view
     * @param {String} args.container - selector for div element to render ace editor
     * @param {String} [args.content] - initial content for the editor
     */
    var SwaggerView = function (args) {
        this._options = args;
        if(!_.has(args, 'container')){
            log.error('container is not specified for rendering swagger view.')
        }
        this._container = _.get(args, 'container');
        this._content = _.get(args, 'content');
        //adding default swagger configs
        window.$$embeddedDefaults = {
            "codegen": {
            },
            "analytics": {
                "google": {
                    "id": ""
                }
            },
            "disableCodeGen": true,
                "examplesFolder": "spec-files/",
                "editorOptions": {
                "theme": "ace/theme/atom_dark"
            },
            "exampleFiles": [
            ],
                "autocompleteExtension": {},
            "useBackendForStorage": false,
                "backendThrottle": 200,
                "keyPressDebounceTime": 200,
                "backendEndpoint": "/editor/spec",
                "useYamlBackend": false,
                "disableFileMenu": false,
                "disableExamples": true,
                "disableImport": true,
                "headerBranding": false,
                "disableNewUserIntro": true,
                "enableTryIt": true,
                "brandingCssClass": "ballerina",
                "importProxyUrl": "https://cors-it.herokuapp.com/?url=",
                "pointerResolutionBasePath": null
        }
    };

    SwaggerView.prototype = Object.create(EventChannel.prototype);
    SwaggerView.prototype.constructor = SwaggerView;

    SwaggerView.prototype.render = function () {
        console.log("SwaggerView.render()");
        this._editor = {};
        this._editor.session = {};
        console.log("-----------------------------------");
        console.log(this._options);
        parent.APIDesigner = new APIDesigner();
        var swaggerEditor = $("#swaggerEditor");
        swaggerEditor.html();
        swaggerEditor.append('<iframe id="se-iframe"  style="border:0px;background: #4a4a4a;" width=100% height="100%"></iframe>');
        document.getElementById('se-iframe').src = swaggerEditor.data("editor-url");

        // this._editor = ace.edit(this._container);
        // //Avoiding ace warning
        // this._editor.$blockScrolling = Infinity;
        // this._editor.setTheme(_.get(this._options, 'theme'));
        // this._editor.setOptions({
        //     enableBasicAutocompletion:true
        // });
        // this._editor.setBehavioursEnabled(true);
        // var self = this;
        // //bind auto complete to key press
        // this._editor.commands.on("afterExec", function(e){
        //     if (e.command.name == "insertstring"&&/^[\w.]$/.test(e.args)) {
        //         self._editor.execCommand("startAutocomplete");
        //     }
        // });
        // this._editor.getSession().setValue(this._content);
        // this._editor.getSession().setMode(_.get(this._options, 'mode'));
        // this._editor.renderer.setScrollMargin(_.get(this._options, 'scroll_margin'), _.get(this._options, 'scroll_margin'));
        // this._editor.setOptions({
        //     fontSize: _.get(this._options, 'font_size')
        // });
    };
        
    /**
     * Set the content of text editor.
     * @param {String} content - content for the editor.
     *
     */
    SwaggerView.prototype.setContent = function(content){
        console.log("SwaggerView.setContent()");
        console.log(content);
        parent.APIDesigner.renderBalSourceToSwagger(content);
        // var beautify = Beautify.js_beautify;
        // var formattedContent = beautify(content, { indent_size: 4 });
        this._editor.session = content;
    };

    SwaggerView.prototype.getContent = function(){
        console.log("SwaggerView.getContent()");
        return this._editor.session;
    };

    SwaggerView.prototype.show = function(){
        console.log("SwaggerView.show()");
        $(this._container).show();
    };

    SwaggerView.prototype.hide = function(){
        console.log("SwaggerView.hide()");
        $(this._container).hide();
    };

    SwaggerView.prototype.isVisible = function(){
        console.log("SwaggerView.isVisible()");
       return  $(this._container).is(':visible')
    };

    return SwaggerView;
});