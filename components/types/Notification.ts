export type Notification = {
  id: number;
  created_at: string;
  data: string;
  receiverId: string;
  senderId: {
    id: string;
    image: string | null;
    name: string;
  };
  title: string;
};