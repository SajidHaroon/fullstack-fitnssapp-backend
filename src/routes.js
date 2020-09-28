// Import packages
const express = require ('express')

const multer = require('multer')

//Import controllers and config files
const verifyToken = require('./config/verifyToken')
const UserController = require('./controllers/UserController')
const EventController = require('./controllers/EventController')
const DashboardController = require('./controllers/DashboardControllers')
const LoginController = require ('./controllers/LoginController')
const RegistrationController = require('./controllers/RegistrationController')
const ApprovalController = require('./controllers/ApprovalController')
const RejectionController = require('./controllers/RejectionController')

//const uploadConfig = require('./config/upload')           // Commented because When we use multer S3 
const uploadToS3 = require ('./config/s3Upload')




// Create instances
// Define middleware which allows us to route from different file
const routes = express.Router()
//Multer instance of our upload config to use functionality
//const upload = multer(uploadConfig)
// Define routes using express Router method
// Checking if app is running fine

routes.get('/status', (req,res) => {
    res.send( { status: 200 })
})


//Eent
// Event creation end point----// Uploading image files/ event creation endpoint using multerS3 to AWS bucket
routes.post('/event', verifyToken, uploadToS3.single("thumbnail"),EventController.createEvent)    
//Then Changed 'filename' to 'location' in line 18 of EventController.createEvent. And also change Events.js EventSchema .virtual return thumbnail URL
// we no longer be storing image files in files folder


//routes.post('/event', verifyToken, upload.single("thumbnail"),EventController.createEvent)
// upload single processes single file upload

/// BEFORE the DashboardController
// // Get event by ID
// routes.get('/event/:eventId', EventController.getEventById)

// // Getting all events
// routes.get('/events', EventController.getAllEvents)

// // Getting events by category
// routes.get('/events/:category', EventController.getAllEvents)

// Deleteing event by ID
routes.delete('/event/:eventId', verifyToken,EventController.delete)



/// NOW BY DashboardControllers
/// DASHBOARD
// Get event by ID
routes.get('/event/:eventId', verifyToken, DashboardController.getEventById)

// Getting all events
//routes.get('/events', DashboardController.getAllEvents)
routes.get('/dashboard', verifyToken, DashboardController.getAllEvents)

// Getting events by category
//routes.get('/events/:category', DashboardController.getAllEvents)
routes.get('/dashboard/:category', verifyToken, DashboardController.getAllEvents)

//Getting events by userId
routes.get('/user/events', verifyToken, DashboardController.getAllEvents)





// User
// Registration
routes.post('/user/register', UserController.createUser)

//Getting user by ID
routes.get('/user/:userId', UserController.getUserById)

// Login
routes.post('/login', LoginController.checkLogIn)

//CreatRegistration
routes.post('/registration/:eventId', verifyToken,RegistrationController.createRegistration)

// Get Registration
routes.get('/registration/:registrationId', RegistrationController.getRegistration)

//GET MY Registrations
routes.get('/registration', verifyToken, RegistrationController.getMyRegistrations)

// DELETE  From My Registration
routes.delete('/registration/delevent/:eventId', verifyToken, RegistrationController.deleteMyRegistrations)



// Approval and Rejection. Both will be post request because we are updating
//Approval Controller
// routes.post('/registration/:registrationId/approvals', ApprovalController.approval)

// //Rejection Controller
// routes.post('/registration/:registrationId/rejections', RejectionController.rejection)


routes.post('/registration/:registrationId/approvals', verifyToken, ApprovalController.approval)
routes.post('/registration/:registrationId/rejections', verifyToken, RejectionController.rejection)


//Rejection

// TODO: LoginController
// TODO: SubscribeController
// TODO: ApprovalController
// TODO: RejectionController

// 07-09
// TODO: Add JWT token to project
// Return token when login
// Send token on request
// Create function to protect routes
// Add function/middleware to routers
// Modify response to decode the token






//Export routes
module.exports = routes