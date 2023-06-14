import { Router } from "express";
import os from "os";
import { randomBytes } from "crypto";
import { hashSync } from "bcrypt"


const router = Router();


/**
 * @route   POST /register
 * ? Account Registration Route
 * @access  Public
 * @returns {Object} Default User Object
 * @returns {String} @cookie Registered Account Token = METEOR_WEB_TOKEN
 * * This route is designed to let a user register an account
*/
router.post("/register", async (req, res) => {
    const userAgent = req.headers["user-agent"] || "Unknown"
    const ip = req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "Unknown"

    const { username, email, password } = req.body

    let errors = []
    if (!username) errors.push("Username is required.")
    if (!email) errors.push("Email is required.")
    if (!password) errors.push("Password is required.")

    // Email Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Email is invalid.")

    // Password Validation
    if (password.length < 8) errors.push("Password must be at least 8 characters long.")
    if (password.length > 128) errors.push("Password must be less than 128 characters long.")
    if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter.")
    if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter.")
    if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number.")
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push("Password must contain at least one special character.")

    if (errors.length > 0) return res.status(400).json({ errors: errors })

    const hashedPassword = hashSync(password, 10)

    const user = await req.db.user.create({
        data: {
            username: username,
            email: email,
            password: hashedPassword,
        }
    })


    // Generate and save the token to the database
    const token = "web_" + randomBytes(64).toString("hex")
    const webToken = await req.db.webToken.create({
        data: {
            token: token,
            ip_address: ip,
            user_agent: userAgent,
            user: {
                connect: {
                    id: user.id
                }
            }
        }
    })

    // Set the cookie
    res.cookie("METEOR_WEB_TOKEN", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365
    })

    res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
    })
})


export default router;