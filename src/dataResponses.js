//mimicking my work for the FIRST api assignment!

const dataFormat = (type, content) => {
    if(type === 'text/xml') {
        let responseXML = '<response>';
        responseXML = `${responseXML} <message>${content.message}</message>`;
        if(content.id) {
            responseXML = `${responseXML} <id>${content.id}</id>`;
        }
        responseXML = `${responseXML} </response>`;
        return responseXML;
    }

    return JSON.stringify(content);
};

const respond = (request, response, status, content, type) => {
    //set the status code and content type
    response.writeHead(status, { 'Content-Type': type });
    //write it to the response
    response.write(content);
    //aaaand send!
    response.end();
};

const badRequest = (request, response, params, type) => {
    const responseJSON = {
      message : 'Invalid Paramaters',
      id : 'badRequest',
    }
    return respond(request, response, 400, dataFormat(type, responseJSON), type);

};

const success = (request, response, params, type) => {
    //replace with whatever success message
    const responseJSON = {
        message: 'Success'
    };

    respond(request, response, 200, dataFormat(type, responseJSON), type);
};



const unauthorized = (request, response, params, type) => {
    const responseJSON = {
        message : 'Authorization failed',
        id : 'unauthorized',
    }
    return respond(request, response, 401, dataFormat(type, responseJSON), type);
};

const forbidden = (request, response, params, type) => {
    const responseJSON = {
        message: 'You do not have access to this content',
        id: 'forbidden',
    };

    return respond(request, response, 403, dataFormat(type, responseJSON), type);
};
  
const internal = (request, response, params, type) => {
    const responseJSON = {
      message: 'Internal Server Error. Something went wrong.',
      id: 'internalError',
    };

    return respond(request, response, 500, dataFormat(type, responseJSON), type);
};
  
const notImplemented = (request, response, params, type) => {
    const responseJSON = {
      message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
      id: 'notImplemented',
    };

    return respond(request, response, 501, dataFormat(type, responseJSON), type);
};
  
const notFound = (request, response, params, type) => {
    const responseJSON = {
      message: 'The page you are looking for was not found.',
      id: 'notFound',
    };

    return respond(request, response, 404, dataFormat(type, responseJSON), type);
};

//okay I can use all of the above to construct stuff for me if needed.
//down here I'm getting into stuff for api ii specifically
let users = {};

const getUsers = (request, response, params, type) => {
    //no clue how well this'll work but ehhhh
    return respond(request, response, 200, dataFormat(type, users), type);
}

const addUser = (request, response, params, type) => {
    if(!params.name || !params.age){
        //then return an error that lack needed paramaters
        return badRequest(request, response, params, type);
    }

    let name = params.name;
    let age = params.age;

    if(users[name]){
        //if such a user already exists
        user[name].age = age;
        return respond(request, response, 204, "", type); 
    }

    //else!
    users[name] = {
        age: age,
        name: name
    };
    respond(request, response, 201, dataFormat(type, users[name]), type);
}



//exports
//api i exports
module.exports.success = success;
module.exports.unauthorized = unauthorized;
module.exports.badRequest = badRequest
module.exports.forbidden = forbidden;
module.exports.internal = internal;
module.exports.notImplemented = notImplemented;
module.exports.notFound = notFound;
//api ii exports
module.exports.getUsers = getUsers;
module.exports.addUser = addUser;