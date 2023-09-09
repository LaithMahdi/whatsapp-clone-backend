const express = require('express');
const db = require('../config/mysqlConfig');
const twilioUtils = require('../utils/twilioUtils');
const cloudinary = require('../config/cloudinaryConfig');
const router = express.Router();




// Sign-up endpoint with Cloudinary image uploadrouter.post('/signup', (req, res) => {
router.post('/signup', (req, res) => {
  const { phone_number, username } = req.body;
  const verificationCode = Math.floor(1000 + Math.random() * 9000);

  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'Profile picture is required' });
  }

  // Upload the file to Cloudinary
  cloudinary.uploader.upload(req.file.path, (cloudinaryErr, cloudinaryResult) => {
    if (cloudinaryErr) {
      console.error('Error uploading image to Cloudinary:', cloudinaryErr);
      return res.status(500).json({ message: 'Error uploading image to Cloudinary' });
    }

    const newUser = {
      phone_number,
      username,
      picture: cloudinaryResult.secure_url, // Store the Cloudinary URL in your database
      verification_code: verificationCode,
      is_verified: false,
    };

    // Insert user data into the database
    db.query('INSERT INTO users SET ?', newUser, (dbErr, results) => {
      if (dbErr) {
        if (dbErr.code === 'ER_DUP_ENTRY') {
          // Handle duplicate phone number error
          res.status(400).json({ message: 'Phone number is already registered' });
        } else {
          console.error('Error creating user:', dbErr);
          res.status(500).json({ message: 'Error creating user' });
        }
      } else {
        // Send SMS verification code
        twilioUtils
          .sendVerificationSMS(phone_number, `Your verification code: ${verificationCode}`)
          .then(() => {
            res.status(201).json({ message: 'User created successfully' });
          })
          .catch((smsError) => {
            console.error('Error sending SMS:', smsError);
            res.status(500).json({ message: 'Error sending SMS' });
          });
      }
    });
  });
});


// Sign-in endpoint
router.post('/signin', (req, res) => {
  const { phone_number, verification_code } = req.body;

  db.query('SELECT * FROM users WHERE phone_number = ?', [phone_number], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ message: 'Error signing in' });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      const user = results[0];
      if (user.is_verified && user.verification_code === verification_code) {
        // User is verified and can log in
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid verification code' });
      }
    }
  });
});

module.exports = router;
