import { Router } from "express";
import { WebAuthHandler } from "../../../middleware/auth";


const router = Router();


/**
 * @route   GET /
 * ? Get All User Tokens
 * @access  Private
 */

router.get("/", WebAuthHandler, async (req, res) => {
    let dbTokens = await req.db.webToken.findMany({
        where: {
            userId: req.user?.id
        }
    })
    let tokens = dbTokens.map(token => {
        return {
            ...token,
            token: undefined
        }
    })
    return res.json(tokens)
})


export default router;