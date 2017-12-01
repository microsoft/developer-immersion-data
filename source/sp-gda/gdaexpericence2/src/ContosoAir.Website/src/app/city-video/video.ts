interface VideoFormats {
    desktop: string;
    mobile: string;
}

interface VideoLink {
    barcelona: string;
}

export interface Video {
    formats: VideoFormats;
    links: VideoLink;
}
