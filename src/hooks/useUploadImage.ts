"use client";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

import { constants } from "@/constants";
import { useProfile } from "@/context/profileContext";
const supabase = createClient(constants.SUPABASE_URL,  constants.SUPABASE_KEY);

export const useUploadImage = (bucket: string) => {
  const {profile} = useProfile();
  const getPublicUrl = (key: string) => {
    const url = constants.SUPABASE_URL + "/storage/v1/object/public" + "/" + key;
    return url;
  };
  const uploadImage = async (file: File) => {
    const { data, error } = await supabase.storage.from(bucket).upload(profile?.id + "/" + uuidv4(), file);
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
  const replaceImage = async (file: File, key: string) => {
    const { data, error } = await supabase.storage.from(bucket).update(key, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (data) return data.fullPath;
    throw new Error(error.message);
  };
  return { uploadImage, getPublicUrl, deleteImage, copyImage, replaceImage };
};
