const db = require('../config/db');

class SessionModel {
  // Create a quiz session (battle or solo)
  static async create(data) {
    const {
      quiz_type, category_id, subject_id, topic_id, micro_topic_id,
      difficulty, question_count, time_per_question, user1_id, user2_id
    } = data;

    const result = await db.query(
      `INSERT INTO quiz_sessions (
        quiz_type, category_id, subject_id, topic_id, micro_topic_id,
        difficulty, question_count, time_per_question, user1_id, user2_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        quiz_type, category_id || null, subject_id || null, topic_id || null, micro_topic_id || null,
        difficulty || 'Medium', question_count, time_per_question || 10, user1_id, user2_id || null
      ]
    );
    return result.rows[0];
  }

  // Get session by id
  static async getById(id) {
    const result = await db.query('SELECT * FROM quiz_sessions WHERE session_id = $1', [id]);
    return result.rows[0];
  }

  // Add question to session
  static async addQuestion(sessionId, questionId, order) {
    const result = await db.query(
      `INSERT INTO quiz_session_questions (session_id, question_id, question_order)
       VALUES ($1, $2, $3) RETURNING *`,
      [sessionId, questionId, order]
    );
    return result.rows[0];
  }

  // Get session questions with full question data
  static async getQuestions(sessionId) {
    const result = await db.query(
      `SELECT qsq.*, q.full_question_text, q.option_a, q.option_b, q.option_c, q.option_d,
              q.correct_answer, q.question_image_url, q.difficulty_label, q.hint
       FROM quiz_session_questions qsq
       JOIN questions q ON qsq.question_id = q.question_id
       WHERE qsq.session_id = $1
       ORDER BY qsq.question_order ASC`,
      [sessionId]
    );
    return result.rows;
  }

  // Submit answer for a question in session
  static async submitAnswer(sessionQuestionId, userId, answer, isUser1) {
    const col = isUser1 ? 'user1_answer' : 'user2_answer';
    const correctCol = isUser1 ? 'user1_correct' : 'user2_correct';

    // Get the correct answer
    const qResult = await db.query(
      `SELECT q.correct_answer FROM quiz_session_questions qsq
       JOIN questions q ON qsq.question_id = q.question_id
       WHERE qsq.id = $1`,
      [sessionQuestionId]
    );

    const isCorrect = qResult.rows[0] && qResult.rows[0].correct_answer === answer;

    await db.query(
      `UPDATE quiz_session_questions SET ${col} = $1, ${correctCol} = $2, answered_at = CURRENT_TIMESTAMP WHERE id = $3`,
      [answer, isCorrect, sessionQuestionId]
    );

    return isCorrect;
  }

  // Complete session
  static async complete(sessionId, winnerId) {
    const result = await db.query(
      `UPDATE quiz_sessions SET status = 'completed', completed_at = CURRENT_TIMESTAMP, winner_id = $1
       WHERE session_id = $2 RETURNING *`,
      [winnerId, sessionId]
    );
    return result.rows[0];
  }

  // Update scores
  static async updateScore(sessionId, user1Score, user2Score) {
    await db.query(
      'UPDATE quiz_sessions SET user1_score = $1, user2_score = $2 WHERE session_id = $3',
      [user1Score, user2Score, sessionId]
    );
  }
}

module.exports = SessionModel;
