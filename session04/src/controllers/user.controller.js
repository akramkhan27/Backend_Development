import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        // console.log(user);
        const accessToken = await user.generateAccessToken()
        // console.log(accessToken);
        const refreshToken = await user.generateRefreshToken()
        // console.log(refreshToken);

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}
const userRegister = asyncHandler(async (req, res) => {
    // takes user detail from frontend
    // we can check body data is correct with joi or right own algo (is empty)
    // check if the user is already available in db
    // check for files, essentially avatar 
    // then upload to cloudinary
    // then save the user detail in db with object
    // remove password and refreshToken filed from response
    // check user registered success in db
    // return createdUser in response

    const {
        userName,
        email,
        fullName,
        password,
    } = req.body

    // The some() method of Array instances tests whether at least one element 
    // in the array passes the test implemented by the provided function. It 
    // returns true if, in the array, it finds an element for which the provided 
    // function returns true; otherwise it returns false. It doesn't modify the array.

    if (
        [userName, email, fullName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")

    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exist with email or username!")
    }

    console.log(req.files);

    const avatarLocalePath = req.files?.avatar[0]?.path;
    // const coverImageLocalePath = req.files?.coverImage[0]?.path; it gives error if no coverImage pass
    let coverImageLocalePath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalePath = req.files.coverImage[0]?.path;
    }

    // console.log(avatarLocalePath);
    // console.log(coverImageLocalePath);

    if (!avatarLocalePath) {
        throw new ApiError(400, "Avater is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalePath)
    const coverImage = await uploadOnCloudinary(coverImageLocalePath) // cloudinary return empty string if not found path

    // console.log(avatar);
    // console.log(coverImage);

    if (!avatar) {
        throw new ApiError(400, "Avatar is required to upload on cloudinary")
    }

    const user = await User.create({
        userName: userName.toLowerCase(),
        email,
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong during user registeration")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            createdUser,
            "User Registered successfully",
        )
    )
})

const userLogin = asyncHandler(async (req, res) => {
    // take username or email and password from body
    // check which is available username or email
    // check password is available
    // find user with email or username
    // generate access token and refresh
    // then send cookie

    const { userName, email, password } = req.body;

    if (!(userName || email)) {
        throw new ApiError(400, "username or email required")
    }
    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })
    console.log(user);
    if (!user) {
        throw new ApiError(400, "user does not exist")
    }

    if (!password) {
        throw new ApiError(400, "password is required")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(400, "password is incorrect")
    }

    // console.log(isPasswordValid);
    // console.log(user._id);
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    // console.log(accessToken);
    // console.log(refreshToken);
    // console.log(user);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // cookie only editable through server
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User Logged in successfully"
            )
        )

})

const userLogout = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, "User logout successfully")
        )

})


// if accesstoken expire then this endpoint help to generate both access token and refresh token again
const accessRefreshToken = asyncHandler(async (req, res) => {
    const getRefreshToken = req.cookies?.refreshToken || req.body.refreshToken
    if (!getRefreshToken) {
        throw new ApiError(400, "Unauthorized request")
    }

    try {
        const decodedToken = await jwt.verify(getRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id);
        if (!user) {
            throw new ApiError(400, "Invalid refresh token")
        }
        if (getRefreshToken !== user.refreshToken) {
            throw new ApiError(400, "Refresh token is expired or used")
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true
        }

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access and Refresh token "
                )
            )
    }
    catch (Error) {
        throw new ApiError(400, Error?.message || "Invalid Refresh token")
    }
})

const changeUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!(oldPassword && newPassword)) {
        new ApiError(400, "password is required")
    }
    const user = await User.findById(req.user?._id)

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) {
        new ApiError(400, "Password is incorrect")
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Password Changed Successfully"
        )
        )

})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = req.user;

    return res.status(200)
        .json(new ApiResponse(
            200,
            user,
            "Current user fetched successfully"
        ))
})

const updateUserDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;
    const options = {};
    if (fullName) {
        options.fullName = fullName
    }
    if (email) {
        options.email = email
    }

    if (!options) {
        throw new ApiError(400, "Give atleast fullName or email to update")
    }

    const userId = req.user?._id;
    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: options
        },
        { new: true }
    ).select("-password -refreshToken")

    return res.status(200)
        .json(new ApiResponse(
            200,
            user,
            "User updated successfully"
        ))

})

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalePath = req.file?.path;

    if (!avatarLocalePath) {
        throw new ApiError(400, "Avatar is required")
    }
    const response = await uploadOnCloudinary(avatarLocalePath);
    if (!response.url) {
        throw new ApiError(400, "Something went wrong during avatar file upload")
    }

    await deleteFromCloudinary(req.user.avatar)

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: response?.url
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    res.status(200)
        .json(new ApiResponse(
            200,
            user,
            "Avatar updated successfully"
        ))

})

const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalePath=req.file?.path
    if(!coverImageLocalePath){
        throw new ApiError(400, "Cover image required");
    }

    const response=await uploadOnCloudinary(coverImageLocalePath);

    if(!response.url){
        throw new ApiError(400, "Something went wrong during cover image file upload")
    }

    await deleteFromCloudinary(req.user.coverImage)

    const user= await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: response.url
            }
        },
        {
            new :true
        }
    ).select("-password -refreshToken")

    res.status(200)
    .json(new ApiResponse(
        200,
        user,
        "Cover image updated successfully"
    ))
})

export {
    userRegister,
    userLogin,
    userLogout,
    accessRefreshToken,
    changeUserPassword,
    getCurrentUser,
    updateUserDetails,
    updateAvatar,
    updateCoverImage
}