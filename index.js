const mongoose = require('mongoose');
const Note=require('./models/note');
const User=require('./models/User');
const path = require('path');


mongoose.connect('mongodb+srv://manasvi16:manasvi123@notesapp.t3vxj9w.mongodb.net/?appName=NOTESAPP', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.log("❌ Error connecting to MongoDB:", err));

const express = require('express');

const app = express()
app.use(express.json())
app.use(express.urlencoded())
const port = 3000


app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.get('/', (req, res) => {
  res.sendFile("pages/index.html",{root:__dirname})
})

app.get('/login',(req,res) =>{
    res.sendFile("pages/login.html",{root:__dirname})
})

app.get('/signup', (req, res) => {
  res.sendFile('pages/signup.html', { root: __dirname });
});

app.post('/getnotes', async(req, res) => {
  try {
    const { email } = req.body;//Array destructuring
    const notes = await Note.find({ email });
    res.status(200).json({ success: true, notes });
  } catch (err) {
    console.error("Error fetching notes:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/login',async (req, res) => { 
  let user=await User.findOne(req.body)
  console.log(user)
  if(!user){
    res.status(200).json({success:false, message:"No user found"})

  }
  else{
    res.status(200).json({success:true,user:{email:user.email},message:"user found"})
  }
  
});

app.post('/signup',async (req, res) => {
  try{
  const {userToken}=req.body
  console.log(req.body)
  const user=await User.create(req.body)
  res.status(200).json({success:true,user});
}catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/addnote', async (req, res) => {
  try {
    const { title, desc, email } = req.body;
    console.log("Received new note:", title, desc, email);

    if (!email || !title || !desc) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // ✅ Create and save a new note in MongoDB
    const newNote = await Note.create({ title, description: desc, email });
    console.log("✅ Note saved:", newNote);

    res.status(200).json({ success: true, note: newNote });
  } catch (err) {
    console.error("❌ Error saving note:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


app.post('/deletenote', (req, res) => {
  const {userToken}=req.body
  res.sendFile('pages/signup.html', { root: __dirname });
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
