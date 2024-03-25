import { z } from 'zod';

const MAX_FILE_SIZE = 4.5 * 1000 * 1000;
const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];
export const MediaRequestSchema = z.object({
  file: z.object({
    name: z.string().min(1),
    type: z.string().refine((type: string) => {
      return ACCEPTED_FILE_TYPES.includes(type);
    }, 'Invalid file MIME type'),
    size: z.number().lte(MAX_FILE_SIZE, 'File size is too big.'),
  }),
  token: z.string(),
});
export type MediaRequest = z.infer<typeof MediaRequestSchema>;

export const MediaResponseSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  filename: z.string(),
  contentType: z.string(),
  size: z.number(),
  createdById: z.string().uuid(),
});
export type MediaResponse = z.infer<typeof MediaResponseSchema>;
