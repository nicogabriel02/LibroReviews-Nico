import { z } from "zod";

export const CreateReview = z.object({
  bookId: z.string().min(1),
  authorName: z.string().trim().min(1).max(60),
  rating: z.number().int().min(1).max(5),
  content: z.string().trim().min(3).max(2000),
});

export type CreateReviewInput = z.infer<typeof CreateReview>;
