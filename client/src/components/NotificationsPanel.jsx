function NotificationsPanel({ onClose }) {
  return (
    <div className="fixed right-4 top-20 w-80 bg-white dark:bg-[#0b1220] rounded-xl shadow-xl z-50">
      <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-white/10">
        <h3 className="font-semibold">Notifications</h3>
        <button onClick={onClose}>✕</button>
      </div>

      <ul className="p-3 space-y-3 text-sm">
        <li>🏆 Achievement unlocked – Quiz Master</li>
        <li>👤 New follower – Sarah Williams</li>
        <li>💰 Quiz reward – $5.25 earned</li>
        <li>📅 Tournament starts soon</li>
      </ul>
    </div>
  );
}

export default NotificationsPanel;
