import { Client, ClientOptions } from "minio";

type MinioClientOptions = ClientOptions & {};

export class MinioClient {
    private client: Client;

    constructor(options: MinioClientOptions) {
        this.client = new Client(options);
    }

}
