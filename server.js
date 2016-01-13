var http = require("http");
var url  = require("url");
var fs   = require("fs");
var port = process.env.PORT || 8080;
var ip   = process.env.IP || "localhost"


var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var server = http.createServer(function(request, response) {
    if(request.method !== "GET") return response.end("Please send a GET request instead.");
    
    request.setEncoding("utf-8");
    
    var r;
    var urlObj = url.parse(request.url);
    var query  = decodeURI(urlObj.pathname.substr(1));

    if(/^[0-9]+$/.test(query))                              r = getDate(query);
    else if(/^[A-Z]\w+ [0-9]{1,2},? [0-9]{4}$/.test(query)) r = getUnix(query);
    else if(query !== "")                                   r = (JSON.stringify({"unix": null, "natural": "null"}));
    // Testing if this is what makes Heroku crash
    /*else if(query === "") {
        r = fs.readFileSync("./public/index.html");
		response.writeHead(200, "Content-Type", "text/html");
		return response.end(r);
    }*/
    
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(r);
});

function getDate(unix) {
    var date = new Date(unix*1000);
    
    var month = months[date.getMonth()];
    var day   = date.getDate();
    var year  = date.getFullYear();
    
    return JSON.stringify({ "unix": unix, "natural": month + " " + day + ", " + year});
}

function getUnix(dateTime) {
    var timestamp = new Date(dateTime).getTime() / 1000;
    return JSON.stringify({ "unix": timestamp.toString(), "natural": dateTime});
}

server.listen(ip, port);