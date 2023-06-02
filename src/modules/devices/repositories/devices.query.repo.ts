import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Devices } from '../devices.schema';

@Injectable()
export class DevicesQueryRepo {
  constructor(
    @InjectModel(Devices.name) private devicesModel: Model<Devices>,
  ) {}
}
