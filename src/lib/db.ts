import { PrismaClient } from '@prisma/client';

class DBClient {
  private static client: PrismaClient;

  static getInstance(): PrismaClient {
    if (this.client) {
      return this.client;
    }
    this.client = new PrismaClient();

    return this.client;
  }
}

export default DBClient;
