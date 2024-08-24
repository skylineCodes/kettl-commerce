import * as hash from 'object-hash';

export function requestToKey(req: any): string {
    const reqDataToHash = {
        query: req.query,
        body: req.body
    };

    return `${req.path}@${hash.sha1(reqDataToHash)}`;
}