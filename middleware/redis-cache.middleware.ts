import { requestToKey } from "@app/common/utils/hash.util";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { Cache } from "cache-manager";
import { NextFunction } from "express";



@Injectable()
export class RedisCacheMiddleware implements NestMiddleware {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    async use(req: Request | any, res: Response | any, next: NextFunction) {
        const key = requestToKey(req);

        const cachedResponse: any = await this.cacheManager.get(key);

        if (cachedResponse) {
            try {
                return res.json(JSON.parse(cachedResponse));
            } catch {
                return res.send(cachedResponse);
            }
        } else {
            const oldSend = res.send;

            res.send = async (data: any) => {
                res.send = oldSend;

                if (res.statusCode.toString().startsWith('2')) {
                    await this.cacheManager.set(key, data, 30);
                }

                return res.send(data);
            }

            next();
        }
    }
}