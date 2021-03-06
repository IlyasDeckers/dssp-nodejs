/*
 * Digital Signature Service Protocol Project.
 * Copyright (C) 2015-2018 e-Contract.be BVBA.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License version
 * 3.0 as published by the Free Software Foundation.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, see 
 * http://www.gnu.org/licenses/.
 */

"use strict";

var dssp = require("../index");

var ansi = require('ansi');
var cursor = ansi(process.stdout);
var fs = require("fs");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

var session = require('express-session');
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.get("/sign", function (req, res) {
    var language = req.query["language"];
    //console.log("language: " + language);
    var dssClient = new dssp.DSSP();
    var landingUrl = "http://localhost:3000/landing";
    var options = {
        language: language,
        mimetype: "application/pdf"
    };
    fs.readFile("example/document.pdf", function (err, data) {
        if (err) {
            console.log(err);
        } else {
            dssClient.sign(data, req.session, landingUrl, res, options)
                .then(_ => {
                    console.log("request sent");
                })
                .catch(error => {
                    console.error("error sending request: " + error);
                    console.error(error);
                    req.session.result = error.message;
                    req.session.signatures = [];
                    res.redirect("result");
                });
        }
    });
});

app.post("/landing", function (req, res, next) {
    console.log("landing");
    var dssClient = new dssp.DSSP();
    dssClient.handleSignResponse(req)
        .then(signedDocument => {
            console.log("success");
            dssClient.verify(signedDocument)
                .then(signatures => {
                    req.session.result = dssp.DSSP_RESULT.SUCCESS;
                    req.session.signatures = signatures;
                    signatures.forEach(function (signature) {
                        console.log("signature", signature);
                    });
                    res.redirect("result");
                })
                .catch(error => {
                    console.error("not a success");
                    console.error(error);
                    req.session.result = error.message;
                    req.session.signatures = [];
                    res.redirect("result");
                });
        })
        .catch(error => {
            console.error("not a success");
            console.error(error);
            req.session.result = error.message;
            req.session.signatures = [];
            res.redirect("result");
        });
});

app.get("/verify", function (req, res) {
    var dssClient = new dssp.DSSP();
    fs.readFile("example/document-signed.pdf", function (err, data) {
        if (err) {
            console.error(err);
        } else {
            dssClient.verify(data)
                .then(signatures => {
                    req.session.result = dssp.DSSP_RESULT.SUCCESS;
                    req.session.signatures = signatures;
                    signatures.forEach(function (signature) {
                        console.log("signature", signature);
                    });
                    res.redirect("result");
                })
                .catch(error => {
                    console.error("not a success");
                    console.error(error);
                    req.session.result = error.message;
                    req.session.signatures = [];
                    res.redirect("result");
                });
        }
    });
});

app.get("/verify2", function (req, res) {
    var dssClient = new dssp.DSSP();
    fs.readFile("example/document-signed-2.pdf", function (err, data) {
        if (err) {
            console.log(err);
        } else {
            dssClient.verify(data)
                .then(signatures => {
                    req.session.result = dssp.DSSP_RESULT.SUCCESS;
                    req.session.signatures = signatures;
                    signatures.forEach(function (signature) {
                        console.log("signature", signature);
                    });
                    res.redirect("result");
                })
                .catch(error => {
                    console.error("not a success");
                    console.error(error);
                    req.session.result = error.message;
                    req.session.signatures = [];
                    res.redirect("result");
                });
        }
    });
});

app.get("/verify3", function (req, res) {
    var dssClient = new dssp.DSSP();
    fs.readFile("example/document.pdf", function (err, data) {
        if (err) {
            console.log(err);
        } else {
            dssClient.verify(data)
                .then(signatures => {
                    req.session.result = dssp.DSSP_RESULT.SUCCESS;
                    req.session.signatures = signatures;
                    signatures.forEach(function (signature) {
                        console.log("signature", signature);
                    });
                    res.redirect("result");
                })
                .catch(error => {
                    console.error("not a success");
                    console.error(error);
                    req.session.result = error.message;
                    req.session.signatures = [];
                    res.redirect("result");
                });
        }
    });
});

app.get("/result", function (req, res) {
    req.session.signatures.forEach(function (signature) {
        console.log("session signature", signature);
    });
    res.render('result', {
        result: req.session.result,
        signatures: req.session.signatures
    });
});

app.use(express.static(__dirname + "/public"));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    cursor.fg.blue();
    cursor.bold();
    cursor.write("Example DSS NodeJS application listening at http://" + host + ":" + port + "\n");
    cursor.fg.red();
    cursor.write("Copyright (C) 2015-2018 e-Contract.BVBA\n");
    cursor.fg.reset();
    cursor.write("\n");
});

