interface Thumbnail {
  token: string;
  formData: FormData;
}

export const uploadThumbnail = async ({ token, formData }: Thumbnail) => {
  try {
    const response = await fetch("http://localhost:5000/upload/thumbnail", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload thumbnail.");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error uploading thumbnail:", error);
    throw error;
  }
};
