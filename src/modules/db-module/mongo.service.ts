import { Connection } from 'mongoose';

import { InjectConnection } from '@nestjs/mongoose';

export class MongoService {
  constructor(@InjectConnection() private _connection: Connection) {}

  getMongoConnection() {
    return this._connection;
  }
}
