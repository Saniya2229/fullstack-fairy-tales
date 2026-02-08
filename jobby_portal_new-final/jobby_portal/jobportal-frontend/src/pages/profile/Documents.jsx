import React, { useEffect, useState, useRef } from "react";
import { getProfile, updateProfile, uploadFile } from "../../api/user";
import { FiFile, FiUpload, FiTrash2, FiExternalLink } from "react-icons/fi";

export default function Documents({ value = [], onChange, onNext, onPrev }) {
  const isInternalUpdate = useRef(false);
  const [docs, setDocs] = useState(Array.isArray(value) ? value : []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    const newVal = Array.isArray(value) ? value : [];
    if (JSON.stringify(newVal) !== JSON.stringify(docs)) {
      setDocs(newVal);
    }
  }, [value]);

  useEffect(() => {
    const newVal = Array.isArray(value) ? value : [];
    if (JSON.stringify(newVal) !== JSON.stringify(docs)) {
      isInternalUpdate.current = true;
      onChange?.(docs);
    }
  }, [docs]);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadFile(file);
      const newDocs = [...docs, { url: res.url, name: file.name }];
      setDocs(newDocs);
      await updateProfile({ documents: newDocs });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. See console.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleRemove(idx) {
    const newDocs = docs.filter((_, i) => i !== idx);
    setDocs(newDocs);
    try {
      await updateProfile({ documents: newDocs });
    } catch (err) {
      console.error("Remove doc failed:", err);
      alert("Failed to remove document.");
    }
  }

  async function handleSaveNext(e) {
    e?.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ documents: docs });
      if (onNext) onNext();
    } catch (err) {
      console.error("Save documents failed:", err);
      alert("Failed to save documents.");
    } finally {
      setSaving(false);
    }
  }

  const getFileIcon = (name) => {
    const ext = name?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return '📄';
    if (['doc', 'docx'].includes(ext)) return '📝';
    if (['png', 'jpg', 'jpeg'].includes(ext)) return '🖼️';
    return '📎';
  };

  return (
    <form onSubmit={handleSaveNext} className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
          <FiFile className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Documents & Certificates</h2>
          <p className="text-sm text-gray-500">Upload your resume, certificates, and other documents</p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-purple-300 rounded-xl p-6 text-center cursor-pointer hover:bg-purple-50 hover:border-purple-400 transition-all"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg"
          onChange={handleUpload}
          className="hidden"
        />
        <FiUpload className="w-10 h-10 mx-auto text-purple-400 mb-3" />
        <p className="text-gray-700 font-medium mb-1">
          {uploading ? "Uploading..." : "Click to upload documents"}
        </p>
        <p className="text-sm text-gray-500">
          PDF, DOCX, PNG, JPG (Max 5MB recommended)
        </p>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {docs.length === 0 && (
          <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-200">
            <FiFile className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm">No documents uploaded yet</p>
          </div>
        )}

        {docs.map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getFileIcon(d.name)}</span>
              <div>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-800 font-medium hover:text-purple-600 transition-colors"
                >
                  {d.name || `Document ${i + 1}`}
                </a>
                <p className="text-xs text-gray-400">Click to download</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.open(d.url, "_blank")}
                className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="View"
              >
                <FiExternalLink className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        {onPrev && (
          <button
            type="button"
            onClick={onPrev}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
        )}
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save and Proceed →"}
        </button>
      </div>
    </form>
  );
}
