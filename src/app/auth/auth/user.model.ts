export class User {
    constructor(
        public email: string,
        private _token: string,
        public role: string,
        private expiresIn: number
    ){}

    get token(){
        return this._token
    }

}