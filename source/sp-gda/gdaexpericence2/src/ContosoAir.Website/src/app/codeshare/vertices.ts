export interface Vertices {
    id: string,
    label: string,
    type: string,
    properties: {
        ContractCarrierId: { id: string, value: string}[],
        ContractCarrierName: { id: string, value: string }[],
        NodeId_Internal: { id: string, value: string }[]
    }[]
}