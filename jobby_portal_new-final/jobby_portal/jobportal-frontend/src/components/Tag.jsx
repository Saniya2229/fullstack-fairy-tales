import { FiTrash2 } from "react-icons/fi";

export default function Tag({ label, onRemove }) {
  return (
    <div className="inline-flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full mr-2 mb-2 text-sm">
      <span>{label}</span>

      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-2 hover:text-red-500 transition"
        >
          <FiTrash2 size={14} />
        </button>
      )}
    </div>
  );
}
