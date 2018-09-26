/* 
 * Copyright 2018 Jonathan Chang.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* global __dirname */
'use strict';
/*
 * Setup Java Environment.
 */
var fs = require('fs');
var java = require('java');
java.options.push('-Dfile.encoding=UTF-8');
var dep_base_dir = './target/classes/lib';
fs.readdirSync(dep_base_dir).forEach(function (dep) {
    java.classpath.push(dep_base_dir + '/' + dep);
});
java.classpath.push('target/classes');
/*
 * Test Java Environment
 */
var ilya_bot = 'io.xtrea.bot.ilya_bot.';
var GamePlay = java.callStaticMethodSync(ilya_bot + 'interfaces.GamePlayImpl', 'getInstance');
var Settings = java.import(ilya_bot + 'tool.Settings');
var JsonObject = java.import('org.json.JSONObject');

function getIncomingParams(arr) {
    var jsonObject = new JsonObject();
    for (var key in arr) {
        if (arr.hasOwnProperty(key))
            jsonObject.putSync(key, arr[key]);
    }
    log('* incoming data: ' + jsonObject.toStringSync());
    return jsonObject;
}

/*
 * Misc Settings.
 */
var os = require('os');
var networkInterfaces = os.networkInterfaces();
var request = require('supertest');
var Transform = require('stream').Transform;
var forever = require('forever');
var service_url = 'http://' + (
        process.env.npm_config_serviceUrl
        || process.env.npm_package_config_serviceUrl
        || forever.config.store.serviceUrl
        ) + ':8081/';
/*
 * Express Init
 */
var path = require('path');
var express = require('express');

var app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})
        .use('/game_data',
                express.static(path.join(__dirname, '/../game_data')))
        .use('/css',
                express.static(path.join(__dirname, '/./css')))
        .use('/images',
                express.static(path.join(__dirname, '/./images')))
        .use('/js',
                express.static(path.join(__dirname, '/./js')))
        .use('/node_modules',
                express.static(path.join(__dirname, '/../node_modules')));

var commands = {

    createSession:
            {route: "/createSession", method: "POST", handler: _createSession},
    gamePlay:
            {route: "/gp/:session_key", method: "GET", handler: _gamePlay},
    listAvailableBots:
            {route: "/", method: "GET", handler: _listAvailableBots},
    createSessionWithBotId:
            {route: "/bot/:id", method: "GET", handler: _createSessionWithBotId},
    currentNode:
            {route: "/current/:session", method: "GET", handler: _current},
    followNext:
            {route: "/follow/:session/:article?", method: "ALL", handler: _follow},
    test:
            {route: "/test", method: "GET", handler: _test},
    undefined:
            {route: "/:page?", method: "GET", handler: _default},

    handler: (req, res, key) => {
        log('* incoming request: ' + key);
        commands[key].handler(req, res);
    }
};

Object.keys(commands).forEach((key) => {
    switch (commands[key].method) {
        case "ALL":
            app.all(commands[key].route, (req, res) => commands.handler(req, res, key));
            break;
        case "POST":
            app.post(commands[key].route, (req, res) => commands.handler(req, res, key));
            break;
        case "GET":
            app.get(commands[key].route, (req, res) => commands.handler(req, res, key));
            break;
    }
});



function _createSession(req, res) {
    var params = getIncomingParams(req.body);
    var retVal = JSON.parse(GamePlay.createSessionSync(params));
    res.send(retVal);
}

function _gamePlay(req, res) {
    var session_key = req.params.session_key;
    var params = getIncomingParams(req.query).putSync('session_key', session_key);
    var retVal = JSON.parse(GamePlay.gamePlaySync(params));
    if (retVal.error) {
        res.send(retVal);
    } else {
        var session_id = retVal.session_id;
        var bot_id = retVal.bot_id;
        var title = retVal.title;
        var description = retVal.description;
        var hashcode = retVal.hashcode;
        var questionaire = 'https://docs.google.com/forms/d/e/1FAIpQLSfJp_2eClROlSundBdQHCbcA3ykSmT590D-hgBQgIJDmO8Hcw/viewform?entry.873951504=';
//                      'https://goo.gl/forms/ykI3IPfCiGJABeQg2'
        res.write('<!-- Begin stream -->\n');
        fs.createReadStream(path.join(__dirname, '/index.html'))
                .pipe(getParser(session_id, bot_id, title, description, hashcode, questionaire))
                .on('end', () => res.write('\n<!-- End stream -->'))
                .pipe(res);
    }

    function getParser(session_id, bot_id, title, description, hashcode, questionaire) {
        var parser = new Transform();
        parser._transform = function (data, encoding, done) {
            const str = data.toString()
                    .replace('{{service_url}}', service_url)
                    .replace('{{session_id}}', session_id)
                    .replace('{{bot_id}}', bot_id)
                    .replace('{{title}}', title)
                    .replace('{{description}}', description)
                    .replace('{{hashcode}}', hashcode)
                    .replace('{{questionaire}}', questionaire);
            this.push(str);
            done();
        };
        return parser;
    }
}

function _listAvailableBots(req, res) {
    var bot_list = JSON.parse(GamePlay.listAvailableBotsSync());
    res.send(bot_list);
}

function _createSessionWithBotId(req, res) {
    var id = req.params.id;
    var bot_session = JSON.parse(GamePlay.createSessionSync(id, Settings.Mode.PUBLISH));
    res.send(bot_session);
}

function _current(req, res) {
    var current_node = JSON.parse(GamePlay.getCurrentNodeSync(req.params.session));
    log(JSON.stringify(current_node));
    res.send(current_node);
}

function _follow(req, res) {
    var reaction = new JsonObject();
    if (req.params.article) {
        reaction.putSync('selected', req.params.article);
    }
    if (req.body) {
        reaction.putSync('input', req.body.input);
    }
    var next_node = JSON.parse(GamePlay.getNextNodeSync(req.params.session, reaction));
    log(JSON.stringify(next_node));
    var ScenicNode = next_node.ScenicNode;
    if (ScenicNode && ScenicNode.node_type === "NodeLinker_Random") {
        next_node = JSON.parse(GamePlay.getNextNodeSync(req.params.session, reaction));
        log(JSON.stringify(next_node));
    }
    res.send(next_node);
}

function _test(req, res) {
    var identity = Settings.test_identity;
    var params = {
        stage: 'begin',
        identity: identity,
        request_id: 'hello'};
    log('negotiate: begin');
    request(app).post('/negotiate')
            .send(params)
            .end(_createSession);
    function _createSession(err, res0) {
        log('createSession');
        var body = res0.body;
        log(body);
        var payload = body.payload;
        var kptool = java.newInstanceSync('io.xtrea.common.crypto.KeyPairTool');
        var keyPairId = java.callStaticMethodSync(
                'io.xtrea.bot.ilya_bot.interfaces.Tools',
                'checkIdentity', kptool, identity);
        kptool.useKeyPairSync(keyPairId);
        var params = {
            identity: identity,
            request_id: body.request_id,
            session_id: kptool.decryptSync(payload).getMessageSync(),
//               game_id: 'DEFOCUSED_EYES'
//         game_id: 'MARS_IMMIGRANT'
            game_id: 'DEMO_SCRIPT'
        };
        request(app).post('/createSession')
                .send(params)
                .end(_gamePlay);
    }

    function _gamePlay(err, res0) {
        log('gamePlay');
        var body = res0.body;
        log(body);
        request(app).get('/' + body.entry)
                .end((err, res0) => res.send(res0.text));
    }
}

function _default(req, res) {
    var page = req.params.page;
    log('page = ' + req.params.page);
    switch (page) {
        case 'favicon.ico':
            res.sendFile(path.join(__dirname, '/images/favicon.ico'));
            break;
        default:
            res.status(404).send('Page not found');
    }
}

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening to ' + host + ':' + port);
    console.log('service_url = ' + service_url);
});

function log(obj) {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? '0' : '') + hour;
    var min = date.getMinutes();
    min = (min < 10 ? '0' : '') + min;
    var sec = date.getSeconds();
    sec = (sec < 10 ? '0' : '') + sec;
    var mil_sec = date.getMilliseconds();
    mil_sec = (mil_sec < 100 ? '0' : '') + (mil_sec < 10 ? '0' : '') + mil_sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? '0' : '') + month;
    var day = date.getDate();
    day = (day < 10 ? '0' : '') + day;
    var day_time = year + '/' + month + '/' + day + ' ' + hour + ':' + min + ':' + sec + '.' + mil_sec;
    console.log((obj + '' === obj) ? '\n%s %s' : '\n%s %O', day_time, obj);
}
