import { useState, useEffect } from 'react';
import { API_BASE, authFetch } from '../config/api';
import { useNavigate } from 'react-router-dom';

function TournamentDetailsModal({ tournamentId, onClose }) {
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attemptsInfo, setAttemptsInfo] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/tournaments/${tournamentId}`);
        const data = await res.json();
        if (data.success) {
          setTournament(data.data);
        }

        if (localStorage.getItem('token')) {
          const attemptsRes = await authFetch(`/tournaments/${tournamentId}/my-attempts`);
          const attemptsData = await attemptsRes.json();
          if (attemptsData.success) {
            setAttemptsInfo(attemptsData.data);
          }
        }

        const lbRes = await fetch(`${API_BASE}/tournaments/${tournamentId}/leaderboard`);
        const lbData = await lbRes.json();
        if (lbData.success) {
          setLeaderboard(lbData.data);
        }
      } catch (err) {
        console.error('Error fetching tournament details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tournamentId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="bg-[#12152a] rounded-xl p-8 max-w-md w-full text-white text-center">
          Loading details...
        </div>
      </div>
    );
  }

  if (!tournament) return null;

  const isClosed = new Date(tournament.registration_deadline || tournament.end_date) < new Date() || tournament.status === 'completed';

  const handlePlay = async () => {
    if (!localStorage.getItem('token')) {
      alert('Please login to play.');
      return;
    }
    if (attemptsInfo && attemptsInfo.attemptsLeft <= 0) {
      alert('You have 0 attempts left.');
      return;
    }
    if (isClosed) {
      alert('Tournament is closed.');
      return;
    }
    try {
      const response = await authFetch('/battle/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            quiz_type: 'solo',
            category_id: tournament.category_id || null,
            subject_id: null,
            subject_name: tournament.subject || null,
            difficulty: null,
            question_count: tournament.total_questions || 50,
            time_per_question: 60
        })
      });

      const data = await response.json();
      if (data.success && data.data?.session?.session_id) {
          navigate(`/play/${data.data.session.session_id}?tournament=${tournamentId}`);
          onClose(); // Close the modal
      } else {
          alert(data.message || 'Failed to start quiz. Make sure there are questions available for this tournament.');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating quiz session.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-[#12152a] rounded-xl w-full max-w-3xl text-white max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">{tournament.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-2xl">&times;</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img src={tournament.thumbnail_url || `https://placehold.co/600x300/1a1a2e/818cf8?text=${encodeURIComponent(tournament.name)}`} alt={tournament.name} className="w-full rounded-lg mb-4" />
              <p className="text-gray-300 text-sm mb-4">{tournament.description || 'Compete with the best quiz enthusiasts.'}</p>
              
              <div className="bg-brand-surface rounded-lg p-4 mb-4">
                <h3 className="text-primary font-bold mb-2">Rules & Information</h3>
                <ul className="text-sm text-gray-300 space-y-1 list-disc pl-4">
                  <li>Total Questions: {tournament.total_questions || 50}</li>
                  <li>Rounds: {tournament.rounds || 1}</li>
                  <li>Subject: {tournament.category_name || tournament.subject}</li>
                  <li>Max Attempts: 3 per user</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="bg-gradient-to-r from-brand-indigoDark to-[#0b0e18] border border-primary/30 rounded-lg p-5 flex-1 mb-4 flex flex-col justify-center items-center text-center">
                {attemptsInfo ? (
                  <>
                    <h3 className="text-xl font-bold text-white mb-2">Your Stats</h3>
                    <div className="flex gap-6 w-full justify-center">
                      <div>
                        <div className="text-3xl font-black text-indigo-500">{attemptsInfo.attemptsLeft}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Attempts Left</div>
                      </div>
                      <div className="w-px bg-white/10"></div>
                      <div>
                        <div className="text-3xl font-black text-green-400">{attemptsInfo.bestScore}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Best Score</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 text-sm">Please login to view your attempts and best score.</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {isClosed ? (
                  <button disabled className="w-full bg-red-500/20 text-red-500 border border-red-500/50 font-bold py-3 rounded-lg text-sm shadow-sm cursor-not-allowed uppercase tracking-wide">
                    Registration Closed
                  </button>
                ) : (
                  <button onClick={handlePlay} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg text-sm shadow-md transition-colors uppercase tracking-wide">
                    Play Now
                  </button>
                )}
                
                <button onClick={() => setShowLeaderboard(!showLeaderboard)} className="w-full border border-gray-600 text-gray-300 font-bold py-3 rounded-lg text-sm hover:bg-white/5 transition-colors uppercase tracking-wide">
                  {showLeaderboard ? 'Hide Leaderboard' : 'View Leaderboard'}
                </button>
              </div>
            </div>
          </div>

          {showLeaderboard && (
            <div className="mt-8 animate-fadeIn">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                🏆 Top Performers
              </h3>
              {leaderboard.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No participants yet</p>
              ) : (
                <div className="bg-brand-surface rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="bg-brand-indigoDark text-gray-400 uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3">Rank</th>
                        <th className="px-4 py-3">Player</th>
                        <th className="px-4 py-3 text-right">Best Score</th>
                        <th className="px-4 py-3 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((pt, idx) => (
                        <tr key={pt.user_id} className="border-b border-gray-700/50 hover:bg-white/5">
                          <td className="px-4 py-3 font-bold text-white">#{idx + 1}</td>
                          <td className="px-4 py-3">{pt.username}</td>
                          <td className="px-4 py-3 text-right font-bold text-indigo-500">{pt.best_score}</td>
                          <td className="px-4 py-3 text-right text-gray-400">{pt.time_taken}s</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default TournamentDetailsModal;
