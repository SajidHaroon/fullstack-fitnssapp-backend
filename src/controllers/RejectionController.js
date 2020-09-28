// const Registration = require('../models/Registration')

// module.exports = {
//     async rejection(req, res) {
//         const { registrationId } = req.params

//         try {
//             const registration = await Registration.findById(registrationId)

//             registration.approved = false

//             await registration.save()

//             return res.json(registration)
//         } catch(error) {
//             return res.status(400).json(error)
//         }
//     }
// }


const Registration = require('../models/Registration')
const jwt = require('jsonwebtoken')

module.exports = {
    
    rejection(req, res) {
        console.log("Rejection done!")
        jwt.verify(req.token, 'secret', async(err, authData) => {
            if(err) {
                res.sendStatus(401)
            } else {
                const { registrationId } = req.params
        
                try {
                    const registration = await Registration.findById(registrationId)

                    if(registration) {
                        registration.approved = false
                        await registration.save()
                    }   
        
                    return res.json(registration)
                } catch(error) {
                    return res.status(400).json(error)
                }
            }
        })
    }
}