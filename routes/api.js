const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

const auth = require('../controllers/authController');
const kid = require('../controllers/kidController');
const learn = require('../controllers/learnController');
const stats = require('../controllers/analyticsController');
const notif = require('../controllers/notifController');

// --- AUTH ROUTES ---
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.post('/auth/verify-pin', auth.verifyPin); // Screen 4
// Update PIN (New functionality)
router.put('/auth/update-pin', auth.updatePin);

// --- KID ROUTES ---
router.post('/kid/add', kid.addKid); // Screen 1 & 2
router.get('/kid/all/:parentId', kid.getKidsByParent);
router.get('/kid/:kidId/profile', kid.getProfile); // Screen 9

// --- CONTENT ROUTES ---
router.get('/dashboard/:kidId', learn.getDashboard); // Screen 5
router.get('/content/lessons', learn.getLessons); // Screen 6
router.get('/content/lesson/:lessonId/questions', learn.getLessonQuestions);
router.post('/content/progress', learn.updateProgress); // Game End

// --- ANALYTICS ROUTES ---
router.get('/analytics/journey/:kidId', stats.getJourneyStats); // Screen 7 & 8

// --- NOTIFICATION ROUTES ---
router.get('/notifications/:kidId', notif.getNotifications); // Screen 10

// --- ADMIN / UPLOAD ROUTES ---
router.post('/admin/upload-media', upload.single('image'), learn.uploadMedia);
router.post('/admin/subject', learn.createSubject);
router.post('/admin/lesson', learn.uploadLesson);

module.exports = router;