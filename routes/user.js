import express from "express";

import userController from "../App/controllers/userController.js";

const router = express.Router();

router.route('/')
    .get(userController.getAll)
    .post(userController.create);


router.route('/:id')
    .get(userController.findOne)
    .patch(
        (req, res,next)=>{
            // Don't allow restricted data for update
            const avoidFields = ['_id', 'password', 'email'];

            // Remove fields
            for(let avoidField of avoidFields)
             delete req.body[avoidField];

            return next();
        },
        userController.updateOne)
    .delete(userController.deleteOne);



export default router;