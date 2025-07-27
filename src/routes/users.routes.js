import Router from "express"
import {registerUser,loginUser,logout,AccesTokenRefresh} from "../controllers/users.controllers.js"
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

    
export default router