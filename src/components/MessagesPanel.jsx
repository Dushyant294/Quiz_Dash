function MessagesPanel({ onClose }) {
  return (
    <div className="fixed right-4 top-20 w-80 bg-white dark:bg-[#0b1220] rounded-xl shadow-xl z-50">
      <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-white/10">
        <h3 className="font-semibold">Recent Messages</h3>
        <button onClick={onClose}>✕</button>
      </div>

      <ul className="p-3 space-y-3 text-sm">
        <li>Alex Johnson – Ready for quiz tournament?</li>
        <li>Michael Brown – Team quiz tomorrow</li>
        <li>Sarah Williams – Thanks for help!</li>
        <li>Emily Davis – Shared quiz resources</li>
      </ul>
    </div>
  );
}

export default MessagesPanel;
