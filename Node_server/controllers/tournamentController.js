const TournamentModel = require('../models/tournamentModel');
const { success, error } = require('../utils/apiResponse');

// @desc    Create tournament
// @route   POST /api/tournaments
// @access  Admin
exports.createTournament = async (req, res) => {
  try {
    const tournament = await TournamentModel.create({
      ...req.body,
      created_by: req.user.userId
    });
    return success(res, tournament, 'Tournament created successfully', 201);
  } catch (err) {
    console.error('Create Tournament Error:', err);
    return error(res, 'Failed to create tournament', 500);
  }
};

// @desc    Get all tournaments
// @route   GET /api/tournaments
// @access  Public
exports.getAllTournaments = async (req, res) => {
  try {
    const { category_id } = req.query;
    const tournaments = await TournamentModel.getAll(category_id);
    return success(res, tournaments, 'Tournaments fetched successfully');
  } catch (err) {
    console.error('Get Tournaments Error:', err);
    return error(res, 'Failed to fetch tournaments', 500);
  }
};

// @desc    Get single tournament
// @route   GET /api/tournaments/:id
// @access  Public
exports.getTournamentById = async (req, res) => {
  try {
    const tournament = await TournamentModel.getById(req.params.id);
    if (!tournament) return error(res, 'Tournament not found', 404);

    const participants = await TournamentModel.getParticipants(req.params.id);
    tournament.participants = participants;

    return success(res, tournament, 'Tournament fetched successfully');
  } catch (err) {
    console.error('Get Tournament Error:', err);
    return error(res, 'Failed to fetch tournament', 500);
  }
};

// @desc    Join tournament
// @route   POST /api/tournaments/:id/join
// @access  Protected
exports.joinTournament = async (req, res) => {
  try {
    const result = await TournamentModel.addParticipant(req.params.id, req.user.userId);

    if (result.alreadyJoined) {
      return error(res, 'You have already joined this tournament', 400);
    }

    return success(res, result, 'Joined tournament successfully');
  } catch (err) {
    console.error('Join Tournament Error:', err);
    return error(res, 'Failed to join tournament', 500);
  }
};

// @desc    Update tournament
// @route   PUT /api/tournaments/:id
// @access  Admin
exports.updateTournament = async (req, res) => {
  try {
    const updated = await TournamentModel.update(req.params.id, req.body);
    if (!updated) return error(res, 'Tournament not found', 404);
    return success(res, updated, 'Tournament updated successfully');
  } catch (err) {
    console.error('Update Tournament Error:', err);
    return error(res, 'Failed to update tournament', 500);
  }
};

// @desc    End tournament
// @route   POST /api/tournaments/:id/end
// @access  Admin
exports.endTournament = async (req, res) => {
  try {
    const ended = await TournamentModel.endTournament(req.params.id);
    if (!ended) return error(res, 'Tournament not found', 404);
    return success(res, ended, 'Tournament ended successfully');
  } catch (err) {
    console.error('End Tournament Error:', err);
    return error(res, 'Failed to end tournament', 500);
  }
};