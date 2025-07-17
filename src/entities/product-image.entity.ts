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

const cloudfront_domain = process.env.CLOUDFRONT_DOMAIN || 'd2yuddzldllm4q.cloudfront.net';
const private_key_secret_name = 'cloudfront/privatekey';
const region = 'us-east-1'; // The region of your Secrets Manager secret
let cloudFrontPrivateKey: string;
const initializePrivateKey = async (): Promise<void> => {
  try {
    const client = new SecretsManagerClient({ region: region });
    const command = new GetSecretValueCommand({ SecretId: private_key_secret_name });
    const response = await client.send(command);

    if (response.SecretString) {
      // cloudFrontPrivateKey = JSON.parse(response.SecretString)["privateKey"].replace(/\\n/g, '\n');
      cloudFrontPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAuUbVxThsrdzbzz/jteoz+vvtkuOJmDs20+V6sKfspwRwogo7
30UQXfPX6zzRfhIBP5jDE2XjXiRPOimfnpXK3YuhMWtyoY/OkBC1W3ETN3qVAQrk
CdQLvEyOUix9qEuwcT+i44i63uXfveTSZmH/qxJZeM6kXfepx/6e5SVM0dF6iWBZ
v6U1WnYbZ1jGWew3VH20uFXB3nBGqeOJWNDNzFdQWgZB976VfAwlmdj0gHZ0SUlg
6zhsacY/VbGeHByaoXpUaQXmCYIQSUADC3nDmK0JFBGMXPzYwnEqjH25+xOvBSKG
1A2Er9YapJHM/SN/LpeRIv6SjFE/CChWfeMmIwIDAQABAoIBAHotRPCuGbS5LNZJ
Sk7+51I96Vdw5p5Vhf1LmZF+2ub0XZXta7f64iUilKMSUw9wrhQTF6jmCn5dMUWo
hxLbspBP8HcXZNs3ar7D1eQ797EhC7tJREFa7HY6gaucnSxq5Sp5DWBAHQK50cZ2
a2yKeT+FdSzeD7PLitFQjdWLuFGvUWcyTyCj75OMX3dWlt4qlBP9TuPyA9BI79r4
Kxs4+jwyuszz1iJQl25J33zUQyqRsFQVfOntUNviSjF7PPa3vl9hgm97OUqhKFwO
CLiEti1QwWciwakSTTpH4PXAIP+daS8sAs1rYYqBW343s/Bnh3avhpZeoxu+i+6I
S6Ew9XECgYEA9dpY6AtpJpBAFYLzO/Txrhlmm4l63zXpL8k9vZ4jOKLC+3GKavXF
WaiGuAzuP4sBhzWm7BxmftnA3srKgy3XHeFuafKsc67+CuQ4XgKYjQdvG55dCSml
UDV80LSFek9XjORC1zZtGIhfWZ14jTHGa5EOFtRNUALpSE3XPAfm8hkCgYEAwOxy
VWCxmrPL4888u1MlX8Gha8MqJP6wF3bq0S011ByGJo1N0ysXQww+ZkEdMxpO68BL
7686Z1g2xIEt+PKFN/6JBfWt2PBzef5RfVHThQTvoBAPrAJcJWdo/bRNoIFfcrEY
KWV4SlTDIH6x4ax7KdDUWbLY5FBUEX79m/0/OZsCgYEAn156MXlsIT5y/D7V07D1
lakLlZmqF9WHop1uM2O2azk+8eXpF2rYEkWnhtmC+5ftVquV2AqU+nfHieSlICHw
B4OhonZYCemO7pqAW5iNMSZ3hMzEfHMNoY/6qAPNXrreAwvYtE+oqrWEMcBdbBGv
EP2Hx465yzsH5AHpmxV4RMkCgYB78u36QKebF001zh3c1Ky8evE1BSz8m82TJcn0
HrHo13KxLjQEKjlF0IX+uHMENDDkcqXXFqPVZe26Dqz0tww0T4rFk3TgXowyotzE
QWA+pE84bVlEUDfXqDriVYdSSgyC6Zj2b8T7LL45EG1E6sYutYbZInkLJzj8DLTw
FaMbZQKBgQCv0d1zPw65oDJlpT1k8jhNpkjnmDdV5fpsMxbS14K5Y+LynySi8qT+
G5E3kPWrfagWkEEX7xY75a6xZgtIK8D/GXaCddKlqGlb4FnY/X0/rd9YTbN1eWfo
NpPmIIebV/ntH7k7wts47VQ7q+tQ7EReHXHgDqEi5COkcGgYxgiw6w==
-----END RSA PRIVATE KEY-----`
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
    const s3ObjectUrl = `https://${cloudfront_domain}/${imagePath}`;

    return getSignedUrl({
      url: s3ObjectUrl,
      dateLessThan: expiration,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID || 'K2MCYESR7OP74D',
      privateKey: cloudFrontPrivateKey,
    });
  }
}