console.log("this works");

function updateDetailedView(cookie){
    console.log(cookie);
    for(var key in cookie) {
        console.log(key);
        console.log(cookie[key]);
        if(cookie[key] === ''){
            htmlstr = "<p>" + "''" + "</p>";
        }else{
            htmlstr = "<p>" + cookie[key] + "</p>";
        }
        $("#"+key).html(htmlstr);
    }
}

