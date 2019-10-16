var mode = 0;
const DBI = require('./db_interface').ChromeDB;
const CC = require('./cookie_crypt');

console.log("this works");

function updateDetailedView(cookie){
    console.log(cookie);
    for(var key in cookie){
        console.log(key);
        console.log(cookie[key]);
        if(cookie[key] === ''){
            htmlstr = "<p>" + "''" + "</p>";
        }else{
            htmlstr = "<p>" + cookie[key] + "</p>";
        }
        $("#"+key).html(htmlstr);
    }
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
    var cipher = new CC.ChromeCrypt();
    for (cookie of cookies) {
        row = $('<tr></tr>');
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

            row.append(`<td>${value}</td>`);
        }

        body.append(row);
    }

    console.log(body);
    table.innerHTML = "";
    table.append(heading);
    table.append(body);
    console.log("Done");
}

function numToDate(num){
    var offset = num/1000;
    var dateOffset = new Date(Date.UTC(1601, 1, 1));
    return new Date(dateOffset.getTime()+offset);
}

function dateToNum(date){ 
    var dateOffset = new Date(Date.UTC(1601, 1, 1));
    var offset = date.getTime()-dateOffset.getTime();
    return (offset*1000);
}

function modifyCookie(cookie){
    console.log(cookie);
    if(mode == 0){
        for(var key in cookie){
            if(key == "expires_utc"){
                htmlstr = '<input type="date" id="' + key + 'input" max="3000-12-31" min="1000-01-01" class="form-control form-control-lg align-self-stretch">';
                console.log(numToDate(cookie[key]));
                console.log(numToDate(dateToNum(numToDate(cookie[key]))));
                console.log(dateToNum(numToDate(cookie[key])));
                console.log(cookie[key]);
            }else{
                htmlstr = '<input type="text" id="' + key + 'input" class="form-control form-control-lg align-self-stretch" placeholder="' + cookie[key] + '" >';
            }
            $("#"+key).html(htmlstr);
        }
        document.getElementById("Modify").innerHTML = "Submit";
        mode = 1;
    }else{
        var newCookie = {};
        for(var key in cookie){
            console.log(key + "input");
            var val = document.getElementById(key + "input").value;
            if(val === ""){
                newCookie[key] = cookie[key];
            }else{
                newCookie[key] = val;
            }
            
        }
        updateDetailedView(newCookie);
        document.getElementById("Modify").innerHTML = "Modify Cookie";
        mode = 0;
    }
}

function submitCookie(){

}

