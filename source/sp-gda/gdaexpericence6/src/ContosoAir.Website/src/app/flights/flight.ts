export interface Flight {
    id: string,
    duration: string,
    distance: number,
    price: number,
    fromCode: string,
    toCode: string,
    stop: number,
    fldate: string,
    segments: {

        airline: string,
        flight: string,
        fromCode: string,
        fromCity: string,
        departTime: string,
        toCode: string,
        toCity: string,
        arrivalTime: string
    }[]
}