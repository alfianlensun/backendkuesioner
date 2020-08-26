function sendError(reply, err){
    reply.code(500)
        .send({
        success:false,
        message: err
    })
}

function sendSuccess(reply, data = {}){
    reply.code(200)
        .send({
            success:true,
            message: "OK",
            data
        })
}

function sendUnsuccess(reply,msg){
    reply.code(200)
        .send({
        success:false,
        message: msg
    })
}

module.exports = {
    sendError,
    sendSuccess,
    sendUnsuccess
}