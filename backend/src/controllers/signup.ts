import { Request, Response, NextFunction } from 'express';
import { UserModel, UserDocument } from "../models/userModel";




const main = (req: Request, res: Response, next: NextFunction) =>{

    // Validate Signup details


    // Create User account
    const user = new UserModel({
        email: req.body.email,
        password: req.body.password
    });

    UserModel.findOne({ email: req.body.email }, (err: NativeError, existingUser: UserDocument) => {
        if (err) { return next(err); }
        if (existingUser) {
            res.send({ status:"error", msg: "Account with that email address already exists." });
        }

        // user.save((err) => {
        //     if (err) { return next(err); }
        //     res.send({ status:"success", msg: "Account Created." });
            
        // });
    });


}
export default main