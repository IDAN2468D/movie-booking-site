import { z } from "zod";

export const movieActionSchema = z.object({
  userId: z.string().min(1, "אנא התחבר כדי להוסיף סרטים לרשימת הצפייה שלך"),
  movieId: z.string().min(1, "מזהה הסרט אינו תקין או שאינו זמין באזורך"),
});
