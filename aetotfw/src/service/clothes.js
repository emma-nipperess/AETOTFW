import { supabase } from "./supabaseClient";

/**
 * Fetches all clothes from the Supabase database.
 * @returns {Promise<Array>} - Array of clothing items with id, name, and front_photo.
 */
export const fetchClothes = async () => {
    const { data, error } = await supabase
      .from("clothes")
      .select("*");
  
    if (error) {
      console.error("Error fetching clothes:", error.message);
      throw error;
    }
  
    return data;
  };
  

  /**
 * Generates a public URL for a given file name in the "clothes" storage bucket.
 * @param {string} fileName - The name of the file in the storage bucket.
 * @returns {string} - The public URL for the file.
 */
export const getItemImage = (fileName) => {
    const { data } = supabase.storage
      .from("clothes")
      .getPublicUrl(fileName);
  
    console.log(data, "image")
    if (!data || !data.publicUrl) {
      console.error(`Error retrieving public URL for file: ${fileName}`);
      return null;
    }
  
    return data.publicUrl;
  };


export const fetchClothesByIds = async (itemIds) => {
  try {
    const { data, error } = await supabase
      .from("clothes") // Replace with your actual table name
      .select("id, name, front_photo")
      .in("id", itemIds);

    if (error) throw error;

    // Map data to include public image URLs
    const itemsWithImages = await Promise.all(
      data.map(async (item) => {
        const imageUrl = await getItemImage(item.front_photo); // Fetch the public image URL
        return { ...item, image: imageUrl };
      })
    );

    return itemsWithImages;
  } catch (error) {
    console.error("Error fetching clothes by IDs:", error.message);
    return [];
  }
};