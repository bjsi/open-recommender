import { Recommendation } from "../schemas/recommendation";

export interface User {
  id: number;
  name: string;
  username: string;
  profile_image_url: string;
  createdAt: Date;
  updatedAt: Date;
  recommendations: Recommendation[];
}
