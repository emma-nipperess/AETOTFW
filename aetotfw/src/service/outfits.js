import { supabase } from "./supabaseClient";

/**
 * Records an outfit in the database.
 * @param {Object} outfit - The outfit details.
 * @param {string[]} outfit.outfit_items - Array of clothing item IDs.
 * @param {Date} outfit.wear_date - The date the outfit will be worn.
 * @param {string} outfit.purpose - The purpose for wearing the outfit.
 * @param {string[]} outfit.crowd - Array of people or groups who will see the outfit.
 * @returns {Promise<void>}
 */
export const recordOutfit = async (outfit) => {
  const { data, error } = await supabase.from("outfits").insert([
    {
      user_id: supabase.auth.user().id, // Use the current user's ID
      outfit_items: outfit.outfit_items,
      wear_date: outfit.wear_date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
      purpose: outfit.purpose,
      crowd: outfit.crowd,
    },
  ]);

  if (error) {
    console.error("Error recording outfit:", error.message);
    throw error;
  }

  return data;
};

/**
 * Checks if the same outfit has been worn in front of the same crowd before.
 * @param {string[]} outfit_items - Array of clothing item IDs.
 * @param {string[]} crowd - Array of people or groups.
 * @returns {Promise<Object[]>} - Array of previously worn outfits that match.
 */
export const checkPreviousOutfits = async (outfit_items, crowd) => {
  const { data, error } = await supabase
    .from("outfits")
    .select("*")
    .contains("outfit_items", outfit_items) // Check if items overlap
    .overlaps("crowd", crowd); // Check if the crowd overlaps

  if (error) {
    console.error("Error checking previous outfits:", error.message);
    throw error;
  }

  return data.map((outfit) => ({
    date: outfit.wear_date,
    items: outfit.outfit_items,
  }));
};
