export interface prod{
    UID: string,
    Barcode: number|string,
    Nomenclature: string,
    QuantityRecorded: number,
    ActualQuantity: string|number,
    Difference: number,
    Updated: boolean,
    loader: boolean
}