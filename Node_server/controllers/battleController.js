const SessionModel = require('../models/sessionModel');
const QuestionModel = require('../models/questionModel');
const ActivityModel = require('../models/activityModel');
const { success, error } = require('../utils/apiResponse');

// @desc    Create a quiz session (1v1 or solo)
// @route   POST /api/battle/create
// @access  Protected
exports.createSession = async (req, res) => {
  try {
    const {
      quiz_type, category_id, subject_id, topic_id, micro_topic_id,
      difficulty, question_count, time_per_question, file_id
    } = req.body;

    if (!quiz_type) {
      return error(res, 'quiz_type is required', 400);
    }

    // 1. Fetch questions first
    let questions = [];
    if (file_id) {
      questions = await QuestionModel.getByFileId(file_id);
      if (questions.length === 0) return error(res, 'No questions found for this quiz', 404);
      // Limit questions if a count was provided
      if (question_count && question_count < questions.length) {
        questions = questions.slice(0, parseInt(question_count));
      }
    } else {
      if (!question_count) return error(res, 'question_count is required when no file_id is provided', 400);
      questions = await QuestionModel.getRandomByFilters({
        category_id,
        subject_id,
        topic_id,
        micro_topic_id,
        difficulty_label: difficulty,
        limit: parseInt(question_count)
      });
    }

    if (questions.length === 0) {
      return error(res, 'No questions match the selected criteria', 404);
    }

    // 2. Create session
    const session = await SessionModel.create({
      quiz_type,
      category_id: category_id || questions[0]?.category_id || null,
      subject_id: subject_id || questions[0]?.subject_id || null,
      topic_id: topic_id || questions[0]?.topic_id || null,
      micro_topic_id: micro_topic_id || questions[0]?.micro_topic_id || null,
      difficulty: difficulty || questions[0]?.difficulty_label || 'Medium',
      question_count: questions.length,
      time_per_question: parseInt(time_per_question) || 10,
      user1_id: req.user.userId,
      user2_id: null
    });

    // 3. Link questions to session
    for (let i = 0; i < questions.length; i++) {
      await SessionModel.addQuestion(session.session_id, questions[i].question_id, i + 1);
    }

    return success(res, {
      session,
      questionCount: questions.length
    }, 'Quiz session created', 201);
  } catch (err) {
    console.error('Create Session Error:', err);
    return error(res, 'Failed to create session', 500);
  }
};

// @desc    Get questions for a session
// @route   GET /api/battle/:sessionId/questions
// @access  Protected
exports.getSessionQuestions = async (req, res) => {
  try {
    const questions = await SessionModel.getQuestions(req.params.sessionId);

    // Remove correct_answer from response (don't leak answers)
    const safeQuestions = questions.map(q => ({
      id: q.id,
      question_id: q.question_id,
      question_order: q.question_order,
      full_question_text: q.full_question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      question_image_url: q.question_image_url,
      difficulty_label: q.difficulty_label
    }));

    return success(res, safeQuestions, 'Session questions fetched');
  } catch (err) {
    console.error('Get Session Questions Error:', err);
    return error(res, 'Failed to fetch session questions', 500);
  }
};

// @desc    Submit answer for a question
// @route   POST /api/battle/:sessionId/answer
// @access  Protected
exports.submitAnswer = async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    const session = await SessionModel.getById(req.params.sessionId);

    if (!session) return error(res, 'Session not found', 404);

    const isUser1 = session.user1_id === req.user.userId;
    const isCorrect = await SessionModel.submitAnswer(questionId, req.user.userId, answer, isUser1);

    return success(res, { isCorrect }, 'Answer submitted');
  } catch (err) {
    console.error('Submit Answer Error:', err);
    return error(res, 'Failed to submit answer', 500);
  }
};

// @desc    Complete a session
// @route   POST /api/battle/:sessionId/complete
// @access  Protected
exports.completeSession = async (req, res) => {
  try {
    const session = await SessionModel.getById(req.params.sessionId);
    if (!session) return error(res, 'Session not found', 404);

    // Calculate scores from answered questions
    const questions = await SessionModel.getQuestions(req.params.sessionId);
    const user1Score = questions.filter(q => q.user1_correct).length;
    const user2Score = questions.filter(q => q.user2_correct).length;

    await SessionModel.updateScore(session.session_id, user1Score, user2Score);

    let winnerId = null;
    if (user1Score > user2Score) winnerId = session.user1_id;
    else if (user2Score > user1Score) winnerId = session.user2_id;

    const completed = await SessionModel.complete(session.session_id, winnerId);

    // Log activity
    await ActivityModel.create({
      user_id: req.user.userId,
      activity_type: 'quiz_completed',
      title: `Completed ${session.quiz_type} quiz with score ${user1Score}/${questions.length}`,
      score: `${user1Score}/${questions.length}`
    });

    return success(res, {
      session: completed,
      user1Score,
      user2Score,
      totalQuestions: questions.length
    }, 'Session completed');
  } catch (err) {
    console.error('Complete Session Error:', err);
    return error(res, 'Failed to complete session', 500);
  }
};