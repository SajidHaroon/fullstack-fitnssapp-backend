// Importing resources/libraries
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// const { response } = require('express')
// const { version } = require('mongoose')

module.exports = {
    async createUser(req, res) {
        try {
            
            const { email, firstName, lastName, password } = req.body

            // Adding following code to check if a user aleary exists
            const existentUser = await User.findOne({email})
            // Based on schema defined in User.js, find one with email matching
            // At first below should create a new user, but second time when matched, will throw an error
            
            // if (!existentUser) {
            //     // Hash Encrypt password before crearting user- https://bcrypt-generator.com/
            //     const hashedPassword = await bcrypt.hash(password, 10) // Round off encrption=10, the more time encrption is run, more secure it is
            //     const user= await User.create ({
            //         // firstName: firstName,
            //         // lastName: lastName,
            //         // email:email,
            //         //password:password

            //         // Just to shorten code, shorthand version below now
            //         firstName,
            //         lastName,
            //         email,
            //         password:hashedPassword
            //     })

            //     //return res.json(user)   // This returns all data including hashed password as a response
            //     return res.json({      // To avoid showing all dat and specify what should return in response
            //         _id:user._id,
            //         email:user.email,
            //         firstName: user.firstName,
            //         lastNme: user.lastName
            //     })
            // }

            if(!existentUser) {
                // Has encrypt password before creating user
                const hashedPassword = await bcrypt.hash(password, 10)
                const userResponse = await User.create({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword
                })
                return jwt.sign( {user: userResponse}, 'secret', (err, token) => {
                    return res.json({
                        user: token,
                        user_id: userResponse._id
                    })
                })
            }



            return res.status(400).json({
                message: 'Email/user already exists. Do you want to login instead'
            })
            
            // First we only made a JSON request. Now we set up a response. See below explanation

            // const user= await User.create ({
            //     firstName: firstName,
            //     lastName: lastName,
            //     email:email,
            //     password:password
            // })

            // return res.json(user)
            

        } catch (err) {
            throw Error("Error while registering new user: ${err}")
        }
    },

    async getUserById (req, res) {
        const { userId } = req.params
        
        try {
            const user = await User.findById(userId)
            return res.json(user)
        } catch(error) {
            return res.status(400).json({
                message: 'User ID does not exist. Do you want to register?'
            })
        }
    }

}


// Json request in insomnia url/register
// {
// 	"email":"test@test121.com",
// 	"password":"password",
// 	"firstName":"New",
// 	"lastName":"Walker"
// }

// when we delcared the response, we got

// {
//     "_id": "5f45e601ef2fbb363c60ab2f",
//     "firstName": "New",
//     "lastName": "Walker",
//     "email": "test@test121.com",
//     "password": "password",
//     "__v": 0
//   }

//   Mongodb adds and id and version, incase you need to go back to previous version of data