import { Component } from '@angular/core';
import {MessageService} from './message.service';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'aw-global-message',
  templateUrl: 'message.component.html'
})
export class MessageComponent {

   constructor(public MessageService:MessageService) { }

}
