const Progress = require('../models/Progress');
const Subject = require('../models/Subject');
const Lesson = require('../models/Lesson');
const Kid = require('../models/Kid');

// Screen 7: Analytics Logic
exports.getJourneyStats = async (req, res) => {
  try {
    const { kidId } = req.params;
    const { filter } = req.query; // 'days' or 'weeks'

    const kid = await Kid.findById(kidId);
    
    // Calculate Date Filter
    let startDate = new Date(0);
    const now = new Date();
    if (filter === 'days') startDate.setDate(now.getDate() - 3);
    if (filter === 'weeks') startDate.setDate(now.getDate() - 7);

    const subjects = await Subject.find({});
    const breakdown = [];
    let grandTotal = 0;
    let grandCompleted = 0;

    for (const sub of subjects) {
      // Total lessons available for this age/subject
      const total = await Lesson.countDocuments({ subject: sub._id, ageGroup: kid.ageGroup });
      
      // Completed in time frame
      const completed = await Progress.countDocuments({
        kid: kidId, subject: sub._id, status: 'completed', completedAt: { $gte: startDate }
      });

      breakdown.push({
        subjectName: sub.name,
        icon: sub.iconUrl,
        color: sub.colorHex,
        percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
        completed,
        total
      });

      grandTotal += total;
      grandCompleted += completed;
    }

    const overallScore = grandTotal === 0 ? 0 : Math.round((grandCompleted / grandTotal) * 100);

    res.json({
      success: true,
      data: { overallScore, totalStars: kid.stats.totalStars, breakdown }
    });

  } catch (e) { res.status(500).json({ error: e.message }); }
};