import { ImagePickerAsset } from "expo-image-picker";


export type Comment = {
  id: number
  postId: number
  text: string | null
  userId: string
  created_at: string
  user: {
    id: string
    image: string | ImagePickerAsset  | null
    name: string | null
  }
};