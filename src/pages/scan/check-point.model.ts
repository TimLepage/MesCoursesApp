export interface ICheckPoint {
    id?: number;
    heure?: string;
    user?: number;
    course?: number;
}

export class CheckPoint implements ICheckPoint {
    constructor(public id?: number, public heure?: string, public user?: number, public course?: number) {}
}
