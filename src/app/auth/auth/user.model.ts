export class User {
    constructor(
        email: string,
        private _token: string,
        role: string,
        private expiresIn: number
    ){}

    get token(){
        return this._token
    }

}