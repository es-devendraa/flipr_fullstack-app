const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const multer = require('multer');
const upload = multer();

router.get('/', async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', upload.none(), async (req, res) => {
  const { email } = req.body;
  const subscription = new Subscription({ email });
  try {
    const newSub = await subscription.save();
    res.status(201).json(newSub);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Email already subscribed' });
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', upload.none(), async (req, res) => {
  const { email } = req.body;
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });
    sub.email = email || sub.email;
    const updated = await sub.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Subscription.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Subscription not found' });
    res.json({ message: 'Subscription deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
