import { Client, type ClientOptions } from 'minio';
import type internal from 'stream';

type MinioClientOptions = ClientOptions & Record<string, unknown>;

export class MinioClient {
	bucket: string;

	private readonly client: Client;
	constructor(options: MinioClientOptions) {
		this.client = new Client(options);
		this.bucket = process.env.S3_BUCKET ?? 'uploads';

		void this.checkBucket();
	}

	async checkBucket() {
		const exists = await this.client.bucketExists(this.bucket);
		if (!exists) await this.client.makeBucket(this.bucket);
		return true;
	}

	async putObject(objectName: string, stream: string | internal.Readable | Buffer, size?: number, meta?: Record<string, unknown>) {
		await this.checkBucket();
		return this.client.putObject(this.bucket, objectName, stream, size, meta);
	}

	async getObject(objectName: string) {
		return this.client.getObject(this.bucket, objectName);
	}
}
