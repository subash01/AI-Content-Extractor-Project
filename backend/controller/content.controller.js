const { extractContentFromUrl } = require('../services/content.service');

exports.extractContent = async (req, res, next) => {
  const { url } = req.body;
  try {
    const result = await extractContentFromUrl(url);
    res.json(result);
  } catch (err) {
    next(err);
  }
};