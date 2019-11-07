var mode = 0;
var globalCookie ; // cookie to store the present cookie being shown on the detailed view
var oldCookie; //Copy of cookie before modification. 
var globalRowid;
const DBI = require('./db_interface').ChromeDB;
DBI.syncLocal();
const CC = require('./cookie_crypt');

console.log("this works");

const NAMES = {
    'creation_utc': 'Creation Time',
    'host_key': 'Website',
    'name': 'Name',
    'value': 'Value',
    'path': 'Path',
    'expires_utc': 'Expiration Time',
    'is_secure': 'Is Secure',
    'is_httponly': 'Is Httponly',
    'last_access_utc': 'Last Access Time',
    'has_expires': 'Has Expires',
    'is_persistent': 'Is Persistent',
    'priority': 'Priority',
    'samesite': 'Samesite'
};

function updateDetailedView(cookie){
    console.log(cookie);
    var cipher = new CC.ChromeCrypt();
    var table = $("#detailedView");
    var heading = table.children('thead');
    var body = $("<tbody></tbody>");
    for (var key in cookie) {
        if (key === "encrypted_value") {
            continue;
        }
        // if (key === "path") {
        //     continue;
        // }
        
        value = cookie[key];
        if (key === "value") {
            if (cookie["encrypted_value"] !== null) {
                try{
                    value = cipher.decrypt(cookie["encrypted_value"]);
                }catch{
                    console.log("messed up a cookie");
                }
                cookie.value = value;
                cookie.encrypted_value = null;
            }
        } else if (key == "creation_utc") {
            value = simpleDate(cookie["creation_utc"])
        }
        else if(key == "expires_utc")  {
            value = simpleDate(cookie["expires_utc"])
        }
        else if(key == "last_access_utc")  {
            value = simpleDate(cookie["last_access_utc"])
        }

        console.log(key);
        console.log(value);
        if(value === ''){
            htmlstr = `<tr><td>${NAMES[key]}</td><td id='${key}'>''</td></tr>`;
        } else {
            htmlstr = `<tr><td>${NAMES[key]}</td><td id='${key}'>${value}</td></tr>`;
        }
        
        body.append(htmlstr);
    }

    globalCookie = cookie;
    
    table.empty();
    table.append(heading);
    table.append(body);

    return 0; //No error hit
}

function retrieveCookies(rv) {
    var cipher = new CC.ChromeCrypt();
    var cookies = DBI.listCookies();
    var cookie;
    var thisD = jQuery.Deferred();
    var buildD = jQuery.Deferred();
    var progress = $("#loadingProgress");
    function build(index) {
        if (index >= cookies.length) {
            buildD.resolve();
        } else {
            cookie = cookies[index];
            cookie["rowid"] = index;
            if (cookie["encrypted_value"] !== null && cookie["encrypted_value"] !== '') {
                try{
                    cookie["value"] = cipher.decrypt(cookie["encrypted_value"]);
                }catch{
                    console.log("messed up a cookie");
                }
                
            }

            progress.html(Math.round((index/cookies.length) * 100));
            setTimeout(build, 0, index+1);
        }

        return buildD.promise();
    }

    build(0).then(function(){
        rv["data"] = cookies;
        thisD.resolve();
    });

    return thisD.promise();
}

function updateTable() {
    console.log("sekhfsre");
    const DBI = require('./db_interface').ChromeDB;
    console.log("Updating table...");
    var cookies = DBI.listCookies();
    var total = cookies.length;
    var count = 0;
    console.log("Got cookies.");

    var table = $("#cookies-dt");
    var heading = 
        "<thead>" +
            "<tr>" +
                "<th>Creation Time</th>" +
                "<th>host_key</th>" +
                "<th>name</th>" +
                "<th>value</th>" +
                "<th>path</th>" +
                "<th>expires_utc</th>" +
                "<th>is_secure</th>" +
                "<th>is_httponly</th>" +
                "<th>last_access_utc</th>" +
                "<th>has_expires</th>" +
                "<th>is_persistent</th>" +
                "<th>priority</th>" +
                "<th>samesite</th>" +
            "</tr>" +
        "</thead>"
    ;
    var body = $('<tbody></tbody>');
    
    var row;
    var cookie;
    var value;
    var rowid = 0;
    var cipher = new CC.ChromeCrypt();
    var numTracking = 0;
    var loadingD = jQuery.Deferred();
    var tableD = jQuery.Deferred();
    
    function buildRow(index) {
        if (index >= cookies.length) {
            loadingD.resolve();
        } else {
            var cookie = cookies[index];
            //google analytics cookie
            if (cookie["name"] === "_ga" || cookie["name"] === "__utma" || cookie["name"] === "__utmz" || cookie["name"] === "_gcl_au" ||
            cookie["name"] === "__qca" || cookie["name"] === "s_ecid" || cookie["name"] === "s_vi" ||  cookie["name"] === "s_cc" || cookie["name"] === "s_sq"
            || cookie["name"] === "s_fid" || cookie["name"] === "adcloud" || cookie["name"] === "_sn" || cookie["name"] === "rat_v" || cookie["name"] === "_ceir") {
                row = $(`<tr class="table-danger" id="${rowid}"></tr>`);
                numTracking++;
            }
            else {
                row = $(`<tr id="${rowid}"></tr>`);
            }

            for (var key in cookie) {
                if (key === "encrypted_value") {
                    continue;
                }

                // if (key === "path") {
                //     continue;
                // }
                
                value = cookie[key];
                if (key === "value") {
                    if (cookie["encrypted_value"] !== null) {
                        value = cipher.decrypt(cookie["encrypted_value"]);
                    }
                }
                else if (key == "creation_utc") {
                    value = simpleDate(cookie["creation_utc"])
                }
                else if(key == "expires_utc")  {
                    value = simpleDate(cookie["expires_utc"])
                }
                else if(key == "last_access_utc")  {
                    value = simpleDate(cookie["last_access_utc"])
                }


            

                row.append(`<td>${value}</td>`);
            }

            body.append(row);
            rowid++;
            count++;
        
            $("#loadingProgress").html(Math.round((count/total) * 100));
            //console.log(Math.round((count/total)*100));

            setTimeout(buildRow, 0, index+1);
        }
    }

    buildRow(0);
    loadingD.promise().then(function(){
        console.log(numTracking);
        console.log(rowid)
        console.log(body);
        table.innerHTML = "";
        table.append(heading);
        table.append(body);
        console.log("Done");
        tableD.resolve();
    });

    return tableD.promise();
}

function simpleDate(num) {
    var options = {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'};
    var offset = num/1000;
    var dateOffset = new Date(Date.UTC(1601, 1, 1));
    
    var simplifiedDate = new Date(dateOffset.getTime()+offset)

    return simplifiedDate.toLocaleDateString('en-us', options);
}

function numToDate(num){
    var offset = num/1000;
    var dateOffset = new Date(Date.UTC(1601, 1, 1));
    
    var simplifiedDate = new Date(dateOffset.getTime()+offset)
    // v  = simplifiedDate.toISOString()

    return simplifiedDate;
    // return simplifiedDate.toISOString()
    // return new Date(dateOffset.getTime()+offset);
}

function dateToNum(date){ 
    var dateOffset = new Date(Date.UTC(1601, 1, 1));
    var offset = date.getTime()-dateOffset.getTime();
    return (offset*1000);
}

function modifyCookie(){
    if(globalCookie != undefined){
        if(mode === 0){
            var htmlstr;
            for(var key in globalCookie){
                if(key == "expires_utc"){
                    var date = numToDate(globalCookie[key]);
                    htmlstr = '<input type="datetime-local" id="' + key + 'input" min="1601-01-01T00:00" max="3000-01-01T00:00" class="form-control form-control-lg align-self-stretch" value="' + date.toISOString().replace('Z', '') +'">';
                }else if(key == "creation_utc"){
                    var date = numToDate(globalCookie[key]);
                    htmlstr = '<input type="datetime-local" id="' + key + 'input" min="1601-01-01T00:00" max="3000-01-01T00:00" class="form-control form-control-lg align-self-stretch" value="' + date.toISOString().replace('Z', '') +'">';
                }else if(key == "last_access_utc"){
                    var date = numToDate(globalCookie[key]);
                    htmlstr = '<input type="datetime-local" id="' + key + 'input" min="1601-01-01T00:00" max="3000-01-01T00:00" class="form-control form-control-lg align-self-stretch" value="' + date.toISOString().replace('Z', '') +'">';
                }else{
                    htmlstr = '<input type="text" id="' + key + 'input" class="form-control form-control-lg align-self-stretch" value="' + globalCookie[key] + '" >';
                }
                $("#"+key).html(htmlstr);
            }
            document.getElementById("Modify").innerHTML = "Submit";
            mode = 1;
        }else{
            var newCookie = {};
            for(var key in globalCookie){
                console.log(key+"input");
                var val = document.getElementById(key + "input");
                if (val === null) {
                    continue;
                } else {
                    val = val.value;
                }
                if(key == "expires_utc"){
                    var date = new Date(val);
                    newCookie[key] = dateToNum(date);
                }else if(key == "creation_utc"){
                    var date = new Date(val);
                    newCookie[key] = dateToNum(date);
                }else if(key == "last_access_utc"){
                    var date = new Date(val);
                    newCookie[key] = dateToNum(date);
                }else{
                    if(val === ""){
                        newCookie[key] = globalCookie[key];
                    }else{
                        newCookie[key] = val;
                    }
                }
                
                newCookie["encrypted_value"] = null;
            }

            oldCookie = globalCookie;
            updateDetailedView(newCookie);
            globalCookie = newCookie;

            if (
                oldCookie.host_key === newCookie.host_key &&
                oldCookie.name === newCookie.name &&
                oldCookie.path === newCookie.path
            ) {
                DBI.modifyCookie(newCookie);
            } else {
                DBI.deleteCookie(oldCookie);
                DBI.addCookie(newCookie);
            }

            document.getElementById("Modify").innerHTML = "Modify Cookie";
            mode = 0;
        }
    }
}

function revertCookie(){
    console.log("starting revert");
    console.log(oldCookie, globalCookie);
    updateDetailedView(oldCookie);
    globalCookie = oldCookie;

    /*if (
        globalCookie.host_key === oldCookie.host_key &&
        globalCookie.name === oldCookie.name &&
        globalCookie.path === oldCookie.path
    ) {
        DBI.modifyCookie(oldCookie);
    } else {
        DBI.deleteCookie(globalCookie);
        DBI.addCookie(oldCookie);
    }*/
    console.log("end revert");
}

//reusued stack overflow snippet
function makeRandomStr(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//make creation time
function makeCreationTime() {
    length = 10;
    var result           = '1319869';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//make expires time
function makeExpiresTime() {
    length = 14;
    var result           = '132';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function randomCookie(cookie) {
    var ranCookie = {};
    ranCookie.creation_utc = makeCreationTime();
    ranCookie.host_key = cookie.host_key;//cookie.host_key = makeRandomStr(15);
    ranCookie.name = cookie.name;//cookie.name = makeRandomStr(10);
    ranCookie.value = makeRandomStr(10);
    ranCookie.path = cookie.path;//cookie.path = '/';
    ranCookie.expires_utc = makeExpiresTime();
    ranCookie.is_secure = Math.floor((Math.random() * 2));
    ranCookie.is_httponly = Math.floor((Math.random() * 2));
    ranCookie.last_access_utc = parseInt(creation_utc,10) + Math.floor((Math.random() * 1000));
    ranCookie.has_expires = Math.floor((Math.random() * 2));
    ranCookie.is_persistent = Math.floor((Math.random() * 2));
    ranCookie.priority = Math.floor((Math.random() * 2));
    //cookie.encrypted_value = makeRandomStr(25);
    ranCookie.samesite = Math.floor((Math.random() * 2));

    return ranCookie;
}

function randomizeCookie() {
    oldCookie = globalCookie;
    newCookie = randomCookie(globalCookie);
    updateDetailedView(newCookie);
    globalCookie = newCookie;
    console.log("Cool",oldCookie, globalCookie);
    if (
        oldCookie.host_key === newCookie.host_key &&
        oldCookie.name === newCookie.name &&
        oldCookie.path === newCookie.path
    ) {
        DBI.modifyCookie(newCookie);
    } else {
        DBI.deleteCookie(oldCookie);
        DBI.addCookie(newCookie);
    }
}

function deleteCookie() {
    DBI.deleteCookie(globalCookie);
}

function pxToNum(s) {
    return Number(s.slice(0, -2));
}

function numToPx(n) {
    return String(n)+"px";
}

function resizeElements() {
    var navHeight = pxToNum($("#mainNav").css('height'));
    var bodyHeight = pxToNum($("body").css('height'));
    var contentHeight = bodyHeight-navHeight;
    console.log(navHeight, bodyHeight, contentHeight);
    $("#mainContent").css('height', numToPx(contentHeight));

    //var dtLengthHeight = $(".dataTables_length").outerHeight(true);
    var dtFilterHeight = $(".dataTables_filter").outerHeight(true);
    //var dtInfoHeight = $(".dataTables_info").outerHeight(true);
    var dtPaginateHeight = $(".dataTables_paginate").outerHeight(true);
    var dtScrollHeadHeight = $(".dataTables_scrollHead").outerHeight(true);
    var dtScrollBodyHeight = contentHeight - (dtFilterHeight + dtPaginateHeight + dtScrollHeadHeight);
    console.log(dtFilterHeight, dtPaginateHeight, dtScrollHeadHeight, dtScrollBodyHeight);
    
    $(".dataTables_scrollBody").css('height', numToPx(dtScrollBodyHeight));
}
var creation_utc = makeCreationTime();
var x = parseInt(creation_utc,10) + Math.floor((Math.random() * 1000));
console.log (x);
