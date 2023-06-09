class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode

        Error.captureStackTrace(this,this.constructor);

    }
    
}
//ha kare che error work
// response kya mokale che
// aa khali error nu construcr j banavu che error return ye oli j karse error.message vali j
module.exports = ErrorHandler