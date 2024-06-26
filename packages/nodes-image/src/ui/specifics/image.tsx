import { PreviewNode } from '../../nodes/preview.js';
import React, { useEffect, useRef } from 'react';

export const ImagePreview = ({ node }) => {


    const theNode = node as PreviewNode;
    const canvasRef = useRef(null);
    const [hasError, setHasError] = React.useState(false);

    const magick = theNode.getImageMagick();

    useEffect(() => {

        if (!magick) {
            return;
        }
        if (!theNode.inputs.image.value?.data) {
            return;
        }

        if (!canvasRef.current) {
            return
        }


        try {
            const canvas = canvasRef.current;
            //@ts-ignore
            magick.read(theNode.cloneImage(theNode.inputs.image.value), (image) => {
                image.writeToCanvas(canvas);
                setHasError(false)
            });
        } catch (err) {
            setHasError(err);
        }

    }, [magick, theNode.inputs.image.value, canvasRef, theNode]);

    return (
        <>
            <canvas ref={canvasRef} width={300} height={300}></canvas>
            {hasError && <div>{hasError.toString()}</div>}
        </>

    );
}

export default ImagePreview