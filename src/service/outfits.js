import { supabase } from "./supabaseClient";
/**
 * Records an outfit in the database.
 */
export const recordOutfit = async (outfit, uid) => {
  const { data, error } = await supabase.from("outfits").insert([
    {
      user_id: uid, // Use the current user's ID
      outfit_items: outfit.outfit_items,
      wear_date: outfit.wear_date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
      purpose: outfit.purpose,
      crowd: outfit.crowd,
      status: outfit.status
    },
  ])
  .select("id");

  console.log(data, "datasigma")

  if (error) {
    console.error("Error recording outfit:", error.message);
    throw error;
  }

  return data[0];
};

/**
 * Checks if the same outfit has been worn in front of the same crowd before.
 * @param {string[]} outfit_items - Array of clothing item IDs.
 * @param {string[]} crowd - Array of people or groups.
 * @returns {Promise<Object[]>} - Array of previously worn outfits that match.
 */
export const checkPreviousOutfits = async (outfit_items, crowd) => {
  try {
    // Ensure crowd is an array
    const formattedCrowd = Array.isArray(crowd)
      ? crowd
      : crowd.split(",").map((person) => person.trim());

    const { data, error } = await supabase
      .from("outfits")
      .select("*")
      .contains("outfit_items", outfit_items) // Check if items overlap
      .overlaps("crowd", formattedCrowd); // Check if the crowd overlaps

    if (error) {
      console.error("Error checking previous outfits:", error.message);
      throw error;
    }

    return data.map((outfit) => ({
      date: outfit.wear_date,
      items: outfit.outfit_items,
    }));
  } catch (err) {
    console.error("Error in checkPreviousOutfits:", err.message);
    throw err;
  }
};


/**
 * Fetch outfits within a given date range.
 * @param {string} startDate - The start date in YYYY-MM-DD format.
 * @param {string} endDate - The end date in YYYY-MM-DD format.
 * @returns {Promise<Array>} - A list of outfits with date, status, purpose, and items.
 */
export const fetchOutfitsByDate = async (startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from("outfits") // Replace "outfits" with your actual table name
      .select("wear_date, status, purpose, outfit_items") // Specify the columns you need
      .gte("wear_date", startDate) // Filter outfits on or after startDate
      .lte("wear_date", endDate); // Filter outfits on or before endDate

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error("Error fetching outfits:", error.message);
    throw error;
  }
};
