import { supabase } from "./supabaseClient";

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * @param {File} file - The file to upload.
 * @param {string} path - The path to store the file (e.g., "clothes/front-photo.jpg").
 * @returns {Promise<string>} - The public URL of the uploaded file.
 */
export const uploadPhoto = async (file, path) => {
  const { error } = await supabase.storage
    .from("clothes") // Replace "photos" with your Supabase Storage bucket name
    .upload(path, file);

  if (error) {
    console.error("Error uploading file:", error.message);
    throw error;
  };
};

/**
 * Inserts clothing item details into the Supabase database.
 * @param {Object} itemDetails - The clothing item details.
 * @returns {Promise<Object>} - The inserted record.
 */
export const saveClothingItem = async (itemDetails) => {
  const { data, error } = await supabase.from("clothes").insert(itemDetails);

  if (error) {
    console.error("Error saving clothing item:", error.message);
    throw error;
  }

  return data;
};
