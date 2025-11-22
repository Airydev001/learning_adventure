const Subject = require('../models/Subject');
const Lesson = require('../models/Lesson');
const Question = require('../models/Question');
const Kid = require('../models/Kid');
const Progress = require('../models/Progress');

// --- ADMIN / UPLOAD LOGIC ---

// 1. Upload Image -> Return URL
exports.uploadMedia = (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.status(201).json({ success: true, url: req.file.path });
};

// 2. Create Subject
exports.createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json({ success: true, data: subject });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// 3. Upload Full Lesson with Questions
exports.uploadLesson = async (req, res) => {
  try {
    const { subjectId, title, ageGroup, questionsData } = req.body;
    
    // Step A: Create all questions in the DB first
    const createdQuestions = await Question.insertMany(questionsData);
    const questionIds = createdQuestions.map(q => q._id);
    
    // Step B: Create Lesson containing these Question IDs
    const lesson = await Lesson.create({
      subject: subjectId,
      title,
      ageGroup,
      questions: questionIds
    });

    res.json({ success: true, data: lesson });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// --- APP / KID LOGIC ---

// 4. Home Screen (Screen 5)
exports.getDashboard = async (req, res) => {
  try {
    const kid = await Kid.findById(req.params.kidId);
    // Only show subjects relevant to kid's age
    const subjects = await Subject.find({ availableForAges: kid.ageGroup });
    res.json({ success: true, kid, subjects });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// 5. Lesson List (Screen 6)
exports.getLessons = async (req, res) => {
  try {
    const { subjectId, kidId } = req.query;
    const kid = await Kid.findById(kidId);
    // Filter lessons by Subject AND Age
    const lessons = await Lesson.find({ subject: subjectId, ageGroup: kid.ageGroup });
    res.json({ success: true, data: lessons });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// 6. Start Lesson (Get Questions)
exports.getLessonQuestions = async (req, res) => {
  try {
    // Populate fills the IDs with actual Question data
    const lesson = await Lesson.findById(req.params.lessonId).populate('questions');
    res.json({ success: true, data: lesson.questions });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// 7. Save Game Progress
exports.updateProgress = async (req, res) => {
  try {
    const { kidId, subjectId, lessonId, score, starsEarned } = req.body;
    
    // Save History
    await Progress.create({ kid: kidId, subject: subjectId, lesson: lessonId, score, starsEarned });

    // Update Kid Stats
    await Kid.findByIdAndUpdate(kidId, {
      $inc: { 'stats.totalStars': starsEarned },
      $set: { 'stats.lastActiveDate': new Date() }
    });

    res.json({ success: true, message: "Progress Saved" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};