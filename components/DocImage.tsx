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
        <div
            className={style || ''}
            style={{
                display: 'block',
                margin: '0 auto',
                maxWidth: '100%',
                width: '100%'
            }}
        >
            <Image
                width={imgWidth}
                height={imgHeight}
                alt={title}
                src={src}
                quality={quality}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 700px"
                style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                }}
            />
        </div>
    );
}

