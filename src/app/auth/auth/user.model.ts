export class User {
    constructor(
        public email: string,
        private _token: string,
        public role: string,
        private _tokenExpirationDate: Date
    ){}

    get token(){
        //comprobar si la fecha del token existe y si la fecha actual es mayor a la del token
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
            return null
        }
        return this._token
    }

}