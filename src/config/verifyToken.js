// next, if certain conditions are met then go to next step
function verifyToken (req, res, next) {                       
    const bearerToken = req.header('user')

    if (typeof bearerToken !== 'undefined') {
        req.token = bearerToken
        next()                        // if condition is true, move next. next is an expressJS function
    }else {
        res.status (401)                  // 401 is unauthorize response error code
    }
}

module.exports = verifyToken