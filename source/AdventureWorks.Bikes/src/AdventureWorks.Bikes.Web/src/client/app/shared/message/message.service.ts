import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {

    InfoMessages:String[]=[];
    ErrorMessages:String[]=[];

    addInfo(message:String) {
        if(-1===this.InfoMessages.indexOf(message)) {
            this.InfoMessages.push(message);
        }
    }

    addError(message:String) {
        if(-1===this.ErrorMessages.indexOf(message)) {
            // this.ErrorMessages.push(message);
        }
    }

    removeMessages() {
        this.ErrorMessages = [];
        this.InfoMessages  = [];
    }

}
