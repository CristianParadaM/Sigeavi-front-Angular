export class Food{
    code;
    name;
    mark;
    price;
    quanty;
    weight;
    inventory;
    date;

    constructor (code:number, name:string, mark:string, price:number, weight:number, quanty:number, inventory:string, date:string){
        this.code = code;
        this.name = name;
        this.mark = mark;
        this.price = price;
        this.quanty = quanty;
        this.weight = weight;
        this.inventory = inventory;
        this.date = date;
    }

}