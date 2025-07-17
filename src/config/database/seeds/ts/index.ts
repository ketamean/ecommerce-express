import categorySeed from './categories.seed';
import productSeed from './products-and-productimges.seed';
import userSeed from './users.seed'
export default async function seed() {
  await categorySeed();
  await productSeed();
  await userSeed();
}
