export interface prod{
    UID: string,
    Barcode: number|string,
    Nomenclature: string,
    QuantityRecorded: number,
    ActualQuantity: string|number,
    Difference: number,
    currentQuantity: number|null,
    loader: boolean
}