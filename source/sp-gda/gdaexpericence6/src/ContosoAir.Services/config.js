module.exports = {
    NOTIFICATION_HUB: process.env.NOTIFICATION_HUB || 'GateChangeNotificationHub',
    NOTIFICATION_SECRET: process.env.NOTIFICATION_SECRET || 'XXXXXXXXXX',
    DOCUMENT_DB_ENDPOINT: process.env.DOC_DB_ENDPOINT || 'XXXXXXXXXX',
    DOCUMENT_DB_PRIMARYKEY: process.env.DOC_DB_PRIMARYKEY || 'XXXXXXXXXX',
    DOCUMENT_DB_DATABASE: process.env.DOC_DB_DATABASE || 'GateChangeDB',
    DOCUMENT_DB_SEAT: process.env.DOC_DB_SEAT || 'SeatsCollection',
    DOCUMENT_DB_BOOKING: process.env.DOC_DB_BOOKING || 'BookingCollection',
    DOCUMENT_DB_Flight: process.env.DOC_DB_Flight || 'FlightsCollection',
    DOCUMENT_DB_FlightDelay: process.env.DOC_DB_FlightDelay || 'FlightDelayCollection',
    GET_FLIGHTS: process.env.GET_FLIGHTS || 'XXXXXXXXXX'
};
