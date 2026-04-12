function MessagesPanel({ onClose, latestNews }) {
  return (
    <div className="fixed right-4 top-20 w-80 bg-white dark:bg-[#0b1220] rounded-xl shadow-xl z-50">
      <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-white/10">
        <h3 className="font-semibold">Recent Messages</h3>
        <button onClick={onClose}>✕</button>
      </div>

      <ul className="p-3 space-y-3 text-sm">
        {latestNews && (
          <li className="p-2 bg-[#5b5bff]/10 border border-[#5b5bff]/20 rounded-md">
            <div className="text-[10px] uppercase font-bold text-[#5b5bff] mb-1">{latestNews.tag || 'LATEST NEWS'}</div>
            <div className="font-semibold">{latestNews.title}</div>
            <div className="text-gray-500 text-xs mt-0.5 max-h-16 overflow-hidden text-ellipsis">{latestNews.description}</div>
          </li>
        )}
        {/* <li>Alex Johnson – Ready for quiz tournament?</li>
        <li>Michael Brown – Team quiz tomorrow</li>
        <li>Sarah Williams – Thanks for help!</li>
        <li>Emily Davis – Shared quiz resources</li> */}
      </ul>
    </div>
  );
}

export default MessagesPanel;