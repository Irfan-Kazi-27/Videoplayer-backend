import Router from "express"
import {registerUser
        ,loginUser
        ,logout
        ,AccesTokenRefresh
        ,changeUserPassword
        ,getCurrentUserProfile
        ,updateUserDetail
        ,updateUserAvatar
        ,updateUserCoverImage 
        ,getUserProfile
        ,getWatchHistory } from "../controllers/users.controllers.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        {name:"avatar",maxCount:1},
        {name:"coverimage",maxCount:1}
    ]),
    registerUser)
router.route("/login").post(loginUser)

//Secured Route (only if user login)
router.route("/logout").post(verifyJWt,logout)
router.route("/refresh-Token").post(AccesTokenRefresh)
router.route("/change-password").post(verifyJWt,changeUserPassword)
router.route("/Current-Userprofile").get(verifyJWt,getCurrentUserProfile)
router.route("/Update-details").patch(verifyJWt,updateUserDetail)
router.route("/Update-Avatar").patch(verifyJWt,upload.single("avatar"),updateUserAvatar)
router.route("/Update-CoverImage").patch(verifyJWt,upload.single("coverimage"),updateUserCoverImage)
router.route("/c/:username").get(verifyJWt,getUserProfile)
router.route("/watchHistory").get(verifyJWt,getWatchHistory)
    
export default router