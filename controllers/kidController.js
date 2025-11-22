const Kid = require('../models/Kid');
const Parent = require('../models/Parent');

exports.addKid = async (req, res) => {
  try {
    const { parentId, name, avatar, ageGroup } = req.body;
    const kid = await Kid.create({ parent: parentId, name, avatar, ageGroup });
    // Link kid to parent
    await Parent.findByIdAndUpdate(parentId, { $push: { kids: kid._id } });
    res.status(201).json({ success: true, data: kid });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getKidsByParent = async (req, res) => {
  const kids = await Kid.find({ parent: req.params.parentId });
  res.json({ success: true, data: kids });
};

// Screen 9: Profile Stats
exports.getProfile = async (req, res) => {
  const kid = await Kid.findById(req.params.kidId);
  res.json({ success: true, data: kid });
};