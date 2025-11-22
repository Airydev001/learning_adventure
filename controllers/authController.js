const Parent = require('../models/Parent');
const jwt = require('jsonwebtoken');

// 1. REGISTER (Sign Up + Set Initial PIN)
exports.register = async (req, res) => {
  try {
    const { email, password, pin } = req.body;

    // Validation: Ensure PIN is provided
    if (!pin || pin.length !== 4) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a 4-digit PIN for Parental Controls." 
      });
    }

    // Check if user exists
    let parent = await Parent.findOne({ email });
    if (parent) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Create Parent (The Model's 'pre-save' hook handles the Hashing)
    parent = await Parent.create({
      email,
      password,
      pin // <--- PIN is passed here and saved securely
    });

    const token = jwt.sign({ id: parent._id }, process.env.JWT_SECRET);
    
    res.status(201).json({ 
      success: true, 
      token, 
      parentId: parent._id,
      message: "Account and PIN created successfully" 
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// 2. LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const parent = await Parent.findOne({ email });

    if (parent && (await parent.matchPassword(password))) {
      const token = jwt.sign({ id: parent._id }, process.env.JWT_SECRET);
      res.json({ success: true, token, parentId: parent._id });
    } else {
      res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// 3. VERIFY PIN (For Screen 4)
exports.verifyPin = async (req, res) => {
  try {
    const { parentId, pin } = req.body;
    console.log(parentId);
    const parent = await Parent.findById(parentId);
    
    if (!parent) return res.status(404).json({ message: "Parent not found" });

    // Check entered PIN against Hashed PIN
    const isMatch = await parent.matchPin(pin);

    if (isMatch) {
      res.json({ success: true, message: "Access Granted" });
    } else {
      res.status(401).json({ success: false, message: "Incorrect PIN" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// 4. UPDATE PIN (New Feature: If parent forgets or wants to change it)
exports.updatePin = async (req, res) => {
  try {
    const { parentId, newPin } = req.body;

    if (!newPin || newPin.length !== 4) {
      return res.status(400).json({ message: "PIN must be 4 digits" });
    }

    const parent = await Parent.findById(parentId);
    if (!parent) return res.status(404).json({ message: "Parent not found" });

    // Update the PIN
    parent.pin = newPin; 
    
    // Save (This triggers the encryption logic in models/Parent.js again)
    await parent.save();

    res.json({ success: true, message: "PIN updated successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};