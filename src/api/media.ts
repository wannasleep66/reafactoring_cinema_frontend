import { api } from "./http";

export type MediaType = "IMAGE" | "AUDIO" | "VIDEO";

export type Media = {
  id: string;
  filename: string;
  contentType: string;
  mediaType: string;
  createdAt: string;
  updatedAt: string;
};

export async function uploadMedia(formData: FormData) {
  const { data } = await api.post<Media>("/media/upload", formData);
  return data;
}

export async function deleteMedial(id: Media["id"]) {
  await api.delete(`/media/${id}`);
}
