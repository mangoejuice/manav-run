import { DocImage } from '../../components/DocImage';

export const docimage = {
    render: DocImage,
    attributes: {
        title: { type: String },
        src: { type: String },
        width: { type: Number },
        height: { type: Number },
        quality: { type: Number },
        style: { type: String },
    },
};
