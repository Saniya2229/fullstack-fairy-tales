import { useRef } from "react";
import { FiUpload } from "react-icons/fi";

export default function FileInput({ label, accept, file, setFile, icon }) {
  const inputRef = useRef(null);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="flex items-center gap-4">
        {/* Preview box */}
        <div className="flex-1 p-4 border border-dashed rounded-lg bg-white shadow">
          <div className="flex items-center gap-4">
            <div className="text-2xl">{icon}</div>

            <div>
              <div className="text-sm text-gray-600">
                {file ? file.name : "Drop file or click Upload"}
              </div>

              {/* If the file is an image, preview it */}
              {file && file.type.includes("image") && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="h-24 rounded mt-2 object-cover"
                />
              )}
            </div>
          </div>
        </div>

        {/* Upload button */}
        <button
          onClick={() => inputRef.current.click()}
          className="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700 transition inline-flex items-center"
        >
          <FiUpload className="mr-2" />
          Upload
        </button>

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>
    </div>
  );
}
