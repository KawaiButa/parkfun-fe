
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "");

export const useUploadImage = (bucket: string) => {
  const data = localStorage.getItem("profile");
  if (!data) throw new Error("You have to login first");
  const profile = JSON.parse(data);
  const getPublicUrl = (key: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(key);
    return data?.publicUrl;
  };
  const uploadImage = async (file: File) => {
    const { data, error } = await supabase.storage.from(bucket).upload(profile.id + "/" + uuidv4(), file);
    if (data) return data.fullPath;
    throw new Error(error.message);
  };
  const deleteImage = async (...args: string[]) => {
    const { error } = await supabase.storage.from(bucket).remove(args);
    if (error) throw new Error(error.message);
  };
  const copyImage = async (source: string, destination: string) => {
    const { data, error } = await supabase.storage.from(bucket).copy(source, destination);
    if (data) return data!.path;
    throw new Error(error.message);
  };
  const getAllImages = async () => {
    const { data, error } = await supabase.storage.from(bucket).list(profile.id, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });
    if(data) return data
    throw new Error(error.message);
  };
  const replaceImage = async (file: File, key: string) => {
    const { data, error } = await supabase
    .storage
    .from(bucket)
    .update(key, file, {
      cacheControl: '3600',
      upsert: true
    })

    if (data) return data.fullPath;
    throw new Error(error.message);
  }
  return { uploadImage, getPublicUrl, deleteImage, copyImage, getAllImages, replaceImage };
};
