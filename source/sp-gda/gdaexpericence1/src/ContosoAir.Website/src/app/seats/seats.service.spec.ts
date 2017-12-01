/* tslint:disable:no-unused-variable */

import { TestBed, inject, async } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { SeatsService } from './seats.service';

describe('Seats Service', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SeatsService,
                MockBackend,
                BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ],
          imports: [
              HttpModule
          ]
        });
     });

    const mockResponse = {
        color: 'blue'
    };

    it('should construct', async(inject([SeatsService, MockBackend], (service, mockBackend) => {
        expect(service).toBeDefined();
    })));

    it('should return the list of seats', async(inject([SeatsService, MockBackend], (service, mockBackend) => {

        mockBackend.connections.subscribe(conn => {
            conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
        });

        const result = service.get();

        result.subscribe(res => {
            expect(res).toEqual({
                color: 'blue'
            });
        });
    })));

});