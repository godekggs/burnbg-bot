'use strict';

const sharp = require('sharp');

module.exports = async (image) => {
    try {
        sharp.concurrency(1);

        const config = {
            width: 512,
            height: 512,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        };

        const background = await sharp({ create: config })
            .webp()
            .toBuffer();

        const buffer = await sharp(image)
            .trim()
            .webp()
            .toBuffer();

        const image_over_background = await sharp(buffer)
            .resize({
                width: 500,
                height: 500,
                fit: sharp.fit.contain
            })
            .webp()
            .toBuffer();

        const sticker = await sharp(background)
            .composite([{ input: image_over_background, gravity: 'centre' }])
            .webp()
            .toBuffer();
        
        return sticker;
    } catch (err) {
        console.error(err);
    }
};