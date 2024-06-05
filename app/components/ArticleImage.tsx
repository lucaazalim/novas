type ArticleImageProps = {
    imageUrl: string | null;
    className?: string;
};

export default function ArticleImage({imageUrl, className}: ArticleImageProps) {
    let image;

    if (imageUrl) {
        image = <img
            src={imageUrl}
            className={`object-cover ${className}`}
        />;
    } else {
        image = <div className="bg-gray-300 w-full h-full"></div>;
    }

    return image;
}