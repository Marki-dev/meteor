import { Client, ClientOptions } from "minio";

type MinioClientOptions = ClientOptions & {};

export class MinioClient {
    private client: Client;
    bucket: string;

    constructor(options: MinioClientOptions) {
        this.client = new Client(options);
        this.bucket = process.env.S3_BUCKET || "uploads"

        // this.checkBucket();
    }

    async checkBucket() {
        const exists = await this.client.bucketExists(this.bucket);
        if (!exists) await this.client.makeBucket(this.bucket);
        return true
    }

    async putObject(objectName: string, stream: any, size?: number) {
        await this.checkBucket()
        return this.client.putObject(this.bucket, objectName, stream, size)
    }
}
