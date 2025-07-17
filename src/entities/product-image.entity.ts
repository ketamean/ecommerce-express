import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Product } from './product.entity';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const cloudfront_domain = process.env.CLOUDFRONT_DOMAIN || '';
const private_key_secret_name = 'cloudfront/privatekey';
const region = 'us-east-1'; // The region of your Secrets Manager secret
let cloudFrontPrivateKey: string;
const initializePrivateKey = async (): Promise<void> => {
  try {
    const client = new SecretsManagerClient({ region: region });
    const command = new GetSecretValueCommand({ SecretId: private_key_secret_name });
    const response = await client.send(command);

    if (response.SecretString) {
      cloudFrontPrivateKey = response.SecretString;
      console.log('Successfully fetched and cached CloudFront private key.');
    } else {
      throw new Error('SecretString is empty.');
    }
  } catch (error) {
    console.error('Failed to fetch private key from Secrets Manager:', error);
    // Exit the process if the key cannot be fetched, as the app cannot function.
    process.exit(1);
  }
};

export { initializePrivateKey }

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  image_url: string = ''; // s3 path

  @Column({ nullable: true })
  alt_text!: string;

  @Column({ default: false })
  is_thumbnail!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })

  product!: Product;

  public getSignedUrl() {
    if (!this.image_url) return null;
    const imagePath = this.image_url
    const expiration = new Date()
    expiration.setMinutes(expiration.getMinutes() + 15); // 15 minutes expiration
    const s3ObjectUrl = `http://${cloudfront_domain}/${imagePath}`;

    return getSignedUrl({
      url: s3ObjectUrl,
      dateLessThan: expiration,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID || '',
      privateKey: cloudFrontPrivateKey,
    });
  }
}