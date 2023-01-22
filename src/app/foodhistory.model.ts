export class FoodHistory{
    code;
    name;
    mark;
    weight;
    quanty;

    constructor (code:number, name:string, mark:string, weight:number, quanty:number){
        this.code = code;
        this.name = name;
        this.mark = mark;
        this.quanty = quanty;
        this.weight = weight;
    }

}