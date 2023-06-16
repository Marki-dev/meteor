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

/**
 * @route   DELETE /all
 * ? Delete All User Tokens
 * @access  Private
 * @returns {{success: boolean}}
 * * This route is designed to delete all user tokens
*/
router.delete("/all", WebAuthHandler, async (req, res) => {
    await req.db.webToken.deleteMany({
        where: {
            userId: req.user?.id
        }
    })
    return res.json({ success: true })
})


/**
 * @route   DELETE /:id
 * ? Delete a User Token
 * @access  Private
 * @returns {{success: boolean}}
 * * This route is designed to delete a user token
 */
router.delete("/:id", WebAuthHandler, async (req, res) => {
    const id = req.params.id
    const token = await req.db.webToken.findFirst({
        where: {
            id: +id,
            userId: req.user?.id
        }
    })
    if (!token) return res.status(400).json({ error: "Invalid token." })

    await req.db.webToken.delete({
        where: {
            id: +id
        }
    })
    return res.json({ success: true })
})



export default router;