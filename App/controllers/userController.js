import User from '../model/user.js';
import catchAsync from '../utils/catchAsyncError.js';
import responseType from '../responses/responseType.js'
import httpStatusCodes from '../responses/httpStatusCodes.js'
import baseError from '../utils/baseError.js';

const userController = {
    getAll: catchAsync(async (req, res, next)=>{
        const users = await User.find();
        return res.status(httpStatusCodes.ACCEPTED).json({
            status: responseType.success,
            totalResults: users.length,
            users
        })
    }),
    create: catchAsync(async (req, res, next)=>{
        const {first_name, last_name, age, email, password, phone} = req.body;

        // Create user
        const newUser = await User.create({first_name, last_name, age, email, password, phone});

        return res.status(httpStatusCodes.CREATED).json({
            status: responseType.success,
            user: newUser
        })
    }),
    findOne: catchAsync(async (req, res, next)=>{
        const user = await User.findById(req.params.id);

        if(!user)
        return next(new baseError("User not found", httpStatusCodes.NOT_FOUND));

        return res.status(httpStatusCodes.CREATED).json({
            status: responseType.success,
            user
        })
    }),
    updateOne: catchAsync(async (req, res, next)=>{
        const updateUser = await User.findByIdAndUpdate(req.params.id, req.body);
        return res.status(httpStatusCodes.ACCEPTED).json({
            status: responseType.success,
            user: updateUser
        });
    }),
    deleteOne: catchAsync(async (req, res, next)=>{
        await User.findByIdAndDelete(req.params.id);
        return res.status(httpStatusCodes.NO_CONTENT).json();
    }),
}

export default userController;