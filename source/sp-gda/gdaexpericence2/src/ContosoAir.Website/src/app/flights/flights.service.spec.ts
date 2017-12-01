/* tslint:disable:no-unused-variable */

import { TestBed, inject, async } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { FlightsService } from './flights.service';

describe('Flights Service', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FlightsService,
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

    it('should construct', async(inject([FlightsService, MockBackend], (service, mockBackend) => {
        expect(service).toBeDefined();
    })));

    it('should return the list of flights', async(inject([FlightsService, MockBackend], (service, mockBackend) => {

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