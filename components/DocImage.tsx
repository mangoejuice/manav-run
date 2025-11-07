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
    // If no width/height provided, use a default aspect ratio
    const imgWidth = width || 800;
    const imgHeight = height || 600;

    return (
        <Image
            width={imgWidth}
            height={imgHeight}
            alt={title}
            src={src}
            quality={quality}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 700px"
            className={style || ''}
            style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                margin: '0 auto',
                maxWidth: '100%'
            }}
        />
    );
}

