export class StageStatus {
    private _stage: string;
    private _pass: number;
    private _fail: number;

    constructor(stage?: string, pass?: number, fail?: number) {
        this._stage = stage;
        this._pass = pass;
        this._fail = fail;
    }

    public getStage(): string {
        return this._stage;
    }

    public setStage(value: string) {
        this._stage = value;
    }

    public getPass(): number {
        return this._pass;
    }

    public setPass(value: number) {
        this._pass = value;
    }

    public getFail(): number {
        return this._fail;
    }

    public setFail(value: number) {
        this._fail = value;
    }
}
