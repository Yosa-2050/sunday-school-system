import { z } from 'zod';

export const FILE_KEY = {
    GROUP: 'group',
    USER: 'user',
    Instructor: 'instructor',
    UNIT: 'unit',
    COURSE: 'course',
    FILES: 'files',
    BRAND: 'brand',
    PromoUrl: 'promoUrl',
    CoverUrl: 'thumbnail',
    Pdf: 'pdf',
    Audio: 'audio',
    Video: 'video',
    Download: 'download',
    Multimedia: 'multimedia',
    Presentation: 'presentation',
    UserAvatar: 'userAvatar',
};
export type FileKeyType = (typeof FILE_KEY)[keyof typeof FILE_KEY];

export type FileStorageObject = {
    url: string;
    pathname?: string;
    contentType?: string;
    contentDisposition?: string;
    downloadUrl?: string;
    uniqueId?: string | null;
};

export type VideoStorage = {
    playbackId: string;
    assetId: string;
    duration: string;
};

export const fileStorageObjectSchema = z.object({
    url: z.string(),
    pathname: z.string(),
    contentType: z.string().optional(),
    downloadUrl: z.string().optional(),
});
