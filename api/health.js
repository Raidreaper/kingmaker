module.exports = (req, res) => {
  res.status(200).json({ 
    ok: true, 
    message: 'Health check passed',
    timestamp: new Date().toISOString()
  });
};
