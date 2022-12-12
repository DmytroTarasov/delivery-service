export interface GetDriverTrucksInterface {
    trucks: Truck[]
}

export interface GetDriverTruckByIdInterface {
    truck: Truck
}

export interface Truck {
    _id: string;
    created_by: string;
    assigned_to: string | null;
    type: string;
    status: string;
    payload: number;
    created_date: string;
}