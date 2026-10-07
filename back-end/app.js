require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data
app.use(express.static('public')) // serve files in the public folder, e.g. images

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})
app.get('/about',(req,res)=> {
  res.json({
    name: 'Tia Mathur',
    about_me: "Hi, I'm Tia Mathur, I'm a rising Junior at NYU, majoring in Econ and Math with a Minor in CS. On the work side, I've interned at Brookfield, where I worked on private equity diligence, and at Optica, a quant hedge fund, where I built regime models and an ETF screening dashboard. I've also written for the Financial Times and the Indian Express. Across all of it, what I keep coming back to is that I'm more interested in investors than in companies: how they read markets, how they allocate, and why they make the decisions they do. At school I'm VP of the Women in Business and Entrepreneurship Club, and I lead pre-calc learning groups, where I write the worksheets and run the sessions. Teaching has been a good way to make sure I actually understand the material myself. Outside of class and work, I play on NYU's club soccer team and play tennis when I get the chance. I've supported Chelsea for a long time and try to watch their matches when I can. I also really like puzzles and games: Sudoku, Lego, and card and board games, especially competitive ones. I think it's the same thing that draws me to math. I like having a problem with clear rules and working out how to get to the answer, whether that's a proof, a puzzle, or a game.",

    imageUrl: 'http://localhost:5002/tia.jpg'
  }) })



// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
