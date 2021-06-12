const router = require('express').Router();
const Message = require('../models/Message');

//add
//http://localhost:7777/api/v1/messages
router.post('/', async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});


//get
//http://localhost:7777/api/v1/messages/conversationId
router.get('/:conversationId', async (req, res) => {
  try { 
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;