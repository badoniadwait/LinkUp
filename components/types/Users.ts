import { ImagePickerAsset } from "expo-image-picker";

export type User = {
    id: string;
    created_at: string;
    name: string | null;
    image: string | ImagePickerAsset  | null;
    bio: string | null;
    email: string | null;
    address: string | null;
    phoneNumber: string | null;
};