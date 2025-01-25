import { supabase } from "../service/supabaseClient";

export const fetchCrowdOptions = async () => {
  const { data, error } = await supabase.from("crowd").select("*");
  if (error) {
    console.error("Error fetching crowd options:", error.message);
    return [];
  }
  return data;
};

export const addCrowdOption = async (name) => {
  const { data, error } = await supabase
    .from("crowd")
    .insert([{ name }])
    .select();
  if (error) {
    console.error("Error adding crowd option:", error.message);
    return null;
  }
  return data[0];
};

export const uploadCrowdForOutfit = async (outfitId, selectedCrowd) => {
    await Promise.all(
        selectedCrowd.map(async (crowd) => {
          await supabase.from("outfitcrowd").insert({
            outfit_id: outfitId,
            crowd_id: crowd.id,
          });
        })
      );
}
