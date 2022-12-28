const response = require("../helper/response");
const utility = require("../helper/utility");
const model = require("../models/db");
const user = model.users;
const admin = model.admins;
const { userLogger,AdminLogger } = require("../logger/logger");
require("dotenv").config();

module.exports = {
 userAuthorization: async(req,res,next)=>{
    try{
        if(!req.headers.authorization){
            return response.errorResponse(res,"Authorization is required");
        }
        const token = req.headers.authorization.split(" ")[1];
        if(!token){
            return response.notFound(res,"Token not found");
        }
        // verify token
        const verify = utility.verifyToken(token);
        
        if(!verify){
            userLogger.error("Unauthorized token");
            return response.unAuthorized(res,"Unauthorized token");
        }
        // find user if exists
        const findUser = await user.findOne({where:{id:verify.id}});
        if(!findUser){
            return response.notFound(res,"User not found");
        }
        if(findUser.blocked){
            return response.errorResponse(res,"Your account is blocked by admin");
        }
        if(findUser.deleted && findUser.deleted_by==2){
            return response.errorResponse(res,"Your account is deleted by admin");
        }
        req.current_user = findUser.dataValues;
        next();
    }
    catch(err){
        userLogger.error("Catch block error at verify token for user",err);
        return response.errorResponseWithData(res,"Something went wrong in middleware",err);
    }
},
adminAuthorization: async(req,res,next)=>{
    try{
        if(!req.headers.authorization){
            return response.errorResponse(res,"Authorization is required");
        }
        const token = req.headers.authorization.split(" ")[1];
        if(!token){
            return response.notFound(res,"Token not found");
        }
        // verify token
        const verify = utility.verifyToken(token);        
        if(!verify){
            AdminLogger.error("Unauthorized token");
            return response.unAuthorized(res,"Unauthorized token");
        }
        // find admin
        const findUser = await admin.findOne({where:{id:verify.id}});
        if(!findUser){
            return response.notFound(res,"Admin not found");
        }
        req.current_user = findUser.dataValues;
        next();
    }
    catch(err){
        AdminLogger.error("Catch block error at token verify for admin",err);
        return response.errorResponseWithData(res,"Something went wrong in admin middleware",err);
    }
}
};
