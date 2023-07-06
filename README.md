
# Meteor

# THIS IS STILL IN DEVELOPMENT, THIS MAY NOT WORK AS EXPECTED
## **Status: Unfunctional**

---

Welcome to Meteor, a simple and self-hostable ShareX Uploader. This project is currently in development, and while it may have some missing features and bugs, I am actively working on improving it.

## Getting Started
Getting started with Meteor is easy as it leverages [Docker](https://docker.com) as its engine. Before you begin, you need to set your basic credentials for the app. By default, Meteor can run independently, but if you prefer, you can use a cloud-provided S3 Bucket service to gain access to a CDN (see instructions in the #ExternalS3Bucket section).

To configure Meteor, you need to modify the docker-compose.yml file. I have provided a template with the required variables, which you need to set with your own credentials for the app's services.


```yml
version: '3.8'

services:
  meteor-app:
    environment:
      - NODE_ENV=production
      - DEV=true
      - DATABASE_URL=mysql://sql-username:sql-password@meteor-db/meteor
      - S3_ENDPOINT=minio
      - S3_BUCKET=meteor
      - S3_PORT=9000
      - S#_BUCKET=bucketname
      - S3_ACCESS_KEY=S3-ACCESS-KEY
      - S3_SECRET_KEY=S3-SECRET-KEY
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    networks:
      - meteor-network
    depends_on:
      - minio

  meteor-db:
    image: mariadb
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=meteor
      - MYSQL_USER=sql-username
      - MYSQL_PASSWORD=sql-password
    ports:
      - "3306:3306"
    networks:
      - meteor-network

  minio:
    image: minio/minio
    command: server /data
    ports:
      - "9000:9000"
    environment:
      - MINIO_ACCESS_KEY=S3-ACCESS-KEY
      - MINIO_SECRET_KEY=S3-SECRET-KEY
    volumes:
      - minio-data:/data
    networks:
      - meteor-network

networks:
  meteor-network:
    driver: bridge

volumes:
  minio-data:

```
Feel free to modify the environment variables according to your setup. Once you have made the necessary changes, you can start the Meteor application by running docker-compose up in the project directory.

Remember to replace `sql-username`, `sql-password`, `S3-ACCESS-KEY`, and `S3-SECRET-KEY` with your actual values. You can also modify other variables to suit your needs.

## External S3 Bucket (Optional)
If you prefer to use a cloud-provided S3 Bucket service and gain access to a CDN, follow these instructions:

Sign up for an account with a cloud storage provider that offers an S3-compatible service (e.g., Amazon S3, DigitalOcean Spaces).
Create a new S3 Bucket within your account.
Obtain the access key and secret key for your S3 Bucket.
Modify the `docker-compose.yml` file as shown above, replacing the `S3_ENDPOINT`, `S3_BUCKET`, `S3_PORT`, `S3_ACCESS_KEY`, and `S3_SECRET_KEY` variables with the corresponding values provided by your cloud storage provider.
Save the changes and start the Meteor application using `docker-compose up`.
That's it! You should now have Meteor up and running, ready to handle your file uploads with ShareX.

Contributing
Contributions to Meteor are welcome! If you find any issues or have ideas for improvements,