export interface User {
    id: number;
    username: string;
    password_hash: string;
    created_at: Date;
}

export interface Video {
    id: number;
    title: string;
    url: string;
    thumbnail_url: string;
    duration: number;
    uploader_id: number;
    created_at: Date;
}

export interface VideoWithUploader extends Video {
    uploader: string;
}
