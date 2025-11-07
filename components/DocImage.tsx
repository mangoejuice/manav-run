import Image from 'next/image';

export function DocImage({
    title,
    src,
    width,
    height,
    quality,
    style
}: {
    title: string,
    src: string,
    width?: number,
    height?: number,
    quality: number,
    style?: string
}) {
    return (
        <Image
            width={width}
            height={height}
            alt={title}
            src={src}
            quality={quality}
        />
    );
}

