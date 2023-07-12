const qrcode = require("qrcode");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../aws/s3");

async function generateAndStoreQRCode(content, filename) {
    try {
        const qrCodeDataUrl = await qrcode.toDataURL(content);

        // Extract base64 data from the QR code data URL
        const base64Data = qrCodeDataUrl.replace(
            /^data:image\/\w+;base64,/,
            ""
        );

        // Convert base64 data to a buffer
        const qrCodeBuffer = Buffer.from(base64Data, "base64");

        // Upload the QR code image to S3
        const uploadParams = {
            Bucket: process.env.S3_QR_CODE_BUCKET_NAME,
            Key: filename,
            Body: qrCodeBuffer,
            ContentType: "image/png", // Adjust the content type based on the QR code image format
        };

        const uploadCommand = new PutObjectCommand(uploadParams);
        await s3.send(uploadCommand);
    } catch (error) {
        console.log(error);
        throw new Error({
            msg: "failed to upload qrcode",
            error,
        });
    }
}

module.exports = { generateAndStoreQRCode };
