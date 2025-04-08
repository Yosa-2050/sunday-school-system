import {
    type CallHandler,
    type ExecutionContext,
    Injectable,
    type NestInterceptor,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(
            map((data) => {
                if (
                    typeof data === 'string' ||
                    Buffer.isBuffer(data) ||
                    typeof data?.pipe === 'function' // detects stream-like objects
                ) {
                    return data;
                }

                if (Array.isArray(data)) {
                    return data.map((item) => instanceToPlain(item));
                }
                return instanceToPlain(data);
            }),
        );
    }
}
