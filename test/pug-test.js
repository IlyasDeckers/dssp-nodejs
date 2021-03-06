/*
 * Digital Signature Service Protocol Project.
 * Copyright (C) 2015-2017 e-Contract.be BVBA.
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

var pug = require('pug');

exports['test Pug'] = function (test) {
    var pendingRequestValue = new Buffer("PendingRequestValue").toString("base64");
    var html = pug.renderFile("./lib/post.pug", {
        actionUrl: "http://hello",
        pendingRequestValue: pendingRequestValue
    });
    console.log(html);
    test.done();
};