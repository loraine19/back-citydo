export class Group {
    id: number;
    address_id: number;
    area: number;
    rules: string;
    name: string;
    created_at: Date;
    updated_at: Date;

    constructor(
        id: number,
        address_id: number,
        area: number,
        rules: string,
        name: string,
        created_at: Date,
        updated_at: Date
    ) {
        this.id = id;
        this.address_id = address_id;
        this.area = area;
        this.rules = rules;
        this.name = name;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
