import React, { useState, useEffect } from "react";

type ThumbnailProps = {
  onThumbnailChange: (file: File | null) => void;
};

const Thumbnail = ({ onThumbnailChange }: ThumbnailProps) => {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailPreview(URL.createObjectURL(file));
      onThumbnailChange(file); // send the file to the parent
    }
  };

  return (
    <div className="flex justify-between items-start gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Thumbnail
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div className="rounded border w-40 h-40 flex items-center justify-center">
        {thumbnailPreview ? (
          <img
            src={thumbnailPreview}
            alt="Thumbnail Preview"
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-gray-400 text-sm">No preview</span>
        )}
      </div>
    </div>
  );
};

export default Thumbnail;
