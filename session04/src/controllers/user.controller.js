import { asyncHandler } from "../utils/asyncHandler.js";

const userRegister= asyncHandler((req, res)=>{
    res.status(200).json({
        message: "User registered successfully"
    })
})

export {userRegister}