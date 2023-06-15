import { Router } from "express";
import { WebAuthHandler } from "../../middleware/auth";


const router = Router();


/**
 * @route   GET /me
 * ? Get Current User Route
 * @access  Private
 * @returns {Object} Default User Object
 * * This route is designed to get the current user's information
 */

router.get("/", WebAuthHandler, async (req, res) => {
    res.json({
        ...req.user,
        password: undefined
    })
})


export default router;