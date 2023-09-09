const { twilioClient, twilioPhoneNumber } = require('../config/twilioConfig');

module.exports = {
  sendVerificationSMS: (to, message) => {
    return twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to,
    });
  },
};
