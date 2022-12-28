module.exports = {
    successResponse:(res,msg)=>{
        return res.status(200).json({
            status:200,
            message:msg
        });
    },
    successResponseWithData:(res,msg,data)=>{
        return res.status(200).json({
            status:200,
            message:msg,
            data:data
        });
    },
    errorResponse:(res,msg)=>{
        return res.status(400).json({
            status:400,
            message:msg
        });
    },
    errorResponseWithData:(res,msg,data)=>{
        return res.status(400).json({
            status:400,
            message:msg,
            data:data
        });
    },

    unAuthorized:(res,msg)=>{
        return res.status(401).json({
            status:401,
            message:msg
        });
    },

    notFound:(res,msg)=>{
        return res.status(404).json({
            status:404,
            message:msg
        });
    }
};