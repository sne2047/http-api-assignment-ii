//yeah a lot of this is gonna be copied over from api assignment 1 till
//i really remember what I was doing

//the outside stuff we need to include
const http = require('http');
const url = require('url');
const query = require('querystring');
//and the other stuff of ours we need to include
const htmlHandler = require('./htmlResponses.js')
const responseHandler = require('./dataResponses.js')

//set up our port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

//And have url parse object here, indexed to urls to reach them
const urlStruct = {
    get:{
        "/style.css" : htmlHandler.getCSS,
        "/": htmlHandler.getHomePage,
        "/getUsers": responseHandler.getUsers,
        other: responseHandler.notFound,
    },
    post: {
        "/addUser": responseHandler.addUser,
        other: responseHandler.notFound,
    }
}

//and a function to actually handle the stuff
const onRequest = (request, response) => {
    console.log(request.url);//for tracking and debugging purpouses

    //parse out the url params
    const parsedUrl = url.parse(request.url);
    const params = query.parse(parsedUrl.query);
    const acceptedTypes = request.headers.accept.split(',');
    let type = 'application/json';
    if(acceptedTypes[0] === 'text/xml') {
        type = 'text/xml';
    }

    /*
    //and then we go in and use the url
    if(urlStruct[request.url]){
        urlStruct[request.url](request, response, params, type);
    } else{
        urlStruct.other(request, response, params, type);
    }
    */
    //need to redo some specialized stuff to handle get and post
    if(request.method === 'POST'){
        handlePost(request, response, parsedUrl, type);
    }
    else{
        handleGet(request, response, parsedUrl, type);
    }
};

const handlePost = (request, response, parsedUrl, type) => {
    if(urlStruct.post[parsedUrl.pathname]){
        const res = response;
        const body = [];

        //if upload errors out throw a bad request and send it back
        request.on('error', (err) => {
            console.dir(err);
            res.statusCode = 400;
            res.end();
        });

        //on data is for each byte of incoming data
        request.on('data', (chunk) => {
            body.push(chunk);
        });

        //on the end of the upload stream
        request.on('end', () => {
            //take byte array and turn to string values
            const bodyString = Buffer.concat(body).toString();

            //since we're getting x-www-form-urlencoded data,
            //format same as querystrings
            //so, parse string into an object by field name
            const bodyParams = query.parse(bodyString);
            //aaand pass to add user.
            urlStruct.post[parsedUrl.pathname](request, res, bodyParams, type);
        });
    }
    else{
        urlStruct.post.other(request, response, params, type);
    }
};

const handleGet = (request, response, parsedUrl, type) => {
    //route to page
    if(urlStruct.get[parsedUrl.pathname]){
        urlStruct.get[parsedUrl.pathname](request, response,parsedUrl, type);
    }
    else{
        urlStruct.get.other(request, response, parsedUrl, type);
    }
}

//and FINAlly set up the server
http.createServer(onRequest).listen(port);

//and a console log for like debugging n stuff
console.log(`Listening on 127.0.0.0:${port}`);