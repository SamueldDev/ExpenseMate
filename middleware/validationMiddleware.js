

import { body, validationResult } from "express-validator";


export const validateRegistration = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("valid email is required"),
    body("password")
        .isLength({ min : 6})
        .withMessage("Password must be at least 6 characters")
];

export const validateLogin = [
     body("email").isEmail().withMessage("valid email is required"),
     body("password").notEmpty().withMessage("Password is required")
];


// validation result middleware
export const validationResultMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            status: "fail",
            message: "validation error",
            data: errors.array()
        })
    }
    next();
}