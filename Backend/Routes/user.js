const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const User = require('../Modal/User');
const {generateToken} = require('../ultils/tokenUtils')
const cookiConfig =require('../ultils/cookieConfig')
const {auth} = require('../middleware/auth')
const multer = require("multer");

router.post('/signUp', async (req, res) => {
  console.log(req.body); 
    try {
        const { email, name } = req.body;


        if (!email ||  !name) {
            return res.status(400).json({ message: 'Email, password, and name are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }
            

        const user = await User.create({ email, name });
        const token = generateToken(user._id);
        res.cookie('token',token,cookiConfig)

        res.status(201).json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/login', async(req,res)=>{
    try{
       const {email }= req.body;
       const user = await User.findOne({email});

       if(!user){
         return res.status(400).json({message: 'Invalid credential'});
       }

       const token = generateToken(user._id);

       
    res.cookie("token", token, {
     httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict", 
         maxAge: 7 * 24 * 60 * 60 * 1000,
     })
       .json({
        token,
        user:{
          _id:user._id,
          name:user.name,
          email:user.email,
          imageUrls:user.imageUrls
        }
       })
    }catch(error){
      res.status(500).json({error: error.message});
    }
})

router.get('/auth/:email', async(req,res)=>{
    try{
       const { email } = req.params; 
       const user = await User.findOne({email});

       if(!user){
         return res.status(400).json({message: 'Invalid credential'});
       }

       const token = generateToken(user._id);

       res.cookie('token',token)
       .json({
        token,
        user:{
          _id:user._id,
          name:user.name,
          email:user.email,
          imageUrls:user.imageUrls
        }
       })
    }catch(error){
      res.status(500).json({error: error.message});
    }
})


router.put('/name/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ name: user.name ,imageUrls:user.imageUrls});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/me',auth,async(req,res)=>{
  try{
    const user = await User.findById(req.user._id);
    if(!user){
      return res.status(404).json({message: 'User not found'});
    }
    res.json(user);
  }catch(error){
    res.status(500).json({error: error.message});
  }
})

router.post('/alluser', async (req, res) => {
  try {
    // Fetch all users and select only name, email, and timestamps
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/updateuser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Check if at least one field is provided
    if (!name && !email) {
      return res.status(400).json({ message: 'Please provide name or email to update.' });
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    ).select('name email createdAt updatedAt');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/deleteuser/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User deleted successfully',
      deletedUser: {
        _id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email,
        createdAt: deletedUser.createdAt,
      }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logOut',(req,res)=>{
  res.clearCookie('token',{
    httpOnly:true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }).json({message:'logged out successfully'})
 
})


const upload = multer({ storage: multer.memoryStorage() });

// Upload & store users
router.post("/upload-json", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Parse JSON file
    let jsonData;
    try {
      jsonData = JSON.parse(req.file.buffer.toString());
    } catch (err) {
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    // Ensure it's an array
    if (!Array.isArray(jsonData)) {
      return res.status(400).json({ error: "JSON must be an array of users" });
    }

    let inserted = 0;
    let skipped = 0;

    for (const u of jsonData) {
      const transformed = {
        _id: u._id?.$oid,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt?.$date ? new Date(u.createdAt.$date) : new Date(),
        updatedAt: u.updatedAt?.$date ? new Date(u.updatedAt.$date) : new Date(),
        __v: u.__v ?? 0
      };

      // Skip duplicates based on email
      const existing = await User.findOne({ email: transformed.email });
      if (existing) {
        skipped++;
        continue;
      }

      await User.create(transformed);
      inserted++;
    }

    res.json({
      message: "Upload Completed",
      inserted,
      skipped,
      total: jsonData.length
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




module.exports = router