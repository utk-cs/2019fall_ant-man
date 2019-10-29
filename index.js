var mode = 0;
var globalCookie ; // cookie to store the present cookie being shown on the detailed view
var oldCookie; //Copy of cookie before modification. 
var globalRowid;
const DBI = require('./db_interface').ChromeDB;
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
        
        value = cookie[key];
        if (key === "value") {
            if (cookie["encrypted_value"] !== null) {
                value = cipher.decrypt(cookie["encrypted_value"]);
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

function updateTable() {
    console.log("sekhfsre");
    const DBI = require('./db_interface').ChromeDB;
    console.log("Updating table...");
    var cookies = DBI.listCookies();

    var table = $("#dtHorizontalVerticalExample");
    var heading = 
        "<thead>" +
            "<tr>" +
                "<th>creation_utc</th>" +
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
    for (cookie of cookies) {
        row = $(`<tr id="${rowid}"></tr>`);
        for (var key in cookie) {
            if (key === "encrypted_value") {
                continue;
            }
            
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
    }

    console.log(body);
    table.innerHTML = "";
    table.append(heading);
    table.append(body);
    console.log("Done");
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
                    htmlstr = '<input type="text" id="' + key + 'input" class="form-control form-control-lg align-self-stretch" placeholder="' + globalCookie[key] + '" >';
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

function submitCookie(){

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
    cookie.creation_utc = makeCreationTime();
    //cookie.host_key = makeRandomStr(15);
    //cookie.name = makeRandomStr(10);
    cookie.value = makeRandomStr(10);
    //cookie.path = '/';
    cookie.expires_utc = makeExpiresTime();
    cookie.is_secure = Math.floor((Math.random() * 2));
    cookie.is_httponly = Math.floor((Math.random() * 2));
    cookie.last_access_utc = parseInt(creation_utc,10) + Math.floor((Math.random() * 1000));
    cookie.has_expires = Math.floor((Math.random() * 2));
    cookie.is_persistent = Math.floor((Math.random() * 2));
    cookie.priority = Math.floor((Math.random() * 2));
    //cookie.encrypted_value = makeRandomStr(25);
    cookie.samesite = Math.floor((Math.random() * 2));

    return cookie;
}

function randomizeCookie() {
    newCookie = randomCookie(globalCookie);

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
}

function deleteCookie() {
    DBI.deleteCookie(globalCookie);
}

var creation_utc = makeCreationTime();
var x = parseInt(creation_utc,10) + Math.floor((Math.random() * 1000));
console.log (x);