const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') // https://www.npmjs.com/package/jsonwebtoken


module.exports = {
    async checkLogIn(req, res) {
        //Grab email and password from request body
        const { email, password } = req.body

        //Check if both input fields have been filled
        

        try {
            if (!email || !password) {
                return res.status(200).json ({
                    message: "Required fields missing!"
                })
            }
            
            // Find the provided email in User database
            
            const user = await User.findOne({email})
            
            //Check if user exists. If not, ask to register
            if (!user) {
                return res.status(200).json ({
                    message: "User not found! Do you want to register?"
                })
            }

            // Check if user and password combo matches
            // Password from server will be hashed, so decrypt and compare
            if (user && await bcrypt.compare(password, user.password) ){
                const userRespone = {    
                    _id: user._id,
                    email: user.email,
                    firstName:user.firstName,
                    lastName: user.lastName
                }
                //return res.json(userRespone)    // Before JWT 
                //https://www.npmjs.com/package/jsonwebtoken > Sign asynchronously: 
                //Example ::::  jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' }, function(err, token) {console.log(token);});

                return jwt.sign({user: userRespone}, 'secret', (err, token) => {
                    return res.json({
                        user: token,
                        user_id : userRespone._id
                    })
                })


            } else {
                return res.status(200).json({
                    message: "Email or password does not match!"
                })
            }
            
        } catch (error) {

            throw Error (`Error while authentication a user ${error}`)
            
        }

        


        

        

    }
    
}