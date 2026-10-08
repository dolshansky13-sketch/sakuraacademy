interface Props {
  notifications: string[];
}

export default function NotificationPanel({ notifications }: Props) {
  return (
    <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/10">
      <h3 className="text-sm font-bold text-white mb-2">📋 Activity Log</h3>
      <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
        {notifications.map((note, idx) => (
          <p
            key={idx}
            className={`text-xs py-1 px-2 rounded ${
              idx === 0 ? 'bg-white/5 text-white' : 'text-gray-500'
            }`}
          >
            {note}
          </p>
        ))}
      </div>
    </div>
  );
}
