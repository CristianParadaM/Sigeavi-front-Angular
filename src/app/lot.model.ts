export class Lot {

    constructor(id:number, lot: string, date: string, sheed: string, quanty: number, race: string) {
        this.id = id;
        this.lot = lot;
        this.date = date;
        this.sheed = sheed;
        this.quanty = quanty;
        this.race = race;
    }
    
    id:number;
    lot: string;
    date: string;
    sheed: string;
    quanty: number;
    race: string;
}