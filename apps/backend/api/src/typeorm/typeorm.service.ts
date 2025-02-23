import { Injectable } from '@nestjs/common';
import type {
    TypeOrmModuleOptions,
    TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import type { SeederOptions } from 'typeorm-extension';
import { dataSourceOptions } from './typeorm-config-helper';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    public createTypeOrmOptions(): TypeOrmModuleOptions & SeederOptions {
        return dataSourceOptions;
    }
}
