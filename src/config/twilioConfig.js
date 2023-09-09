const twilio = require('twilio');
require('dotenv').config(); 
const twilioClient = twilio(process.env.AccountSID, process.env.AuthToken);
const twilioPhoneNumber = process.env.PhoneNumber;

module.exports = {
  twilioClient,
  twilioPhoneNumber,
};
