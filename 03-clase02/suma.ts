export class Suma {
    private num1;
    private num2;
    constructor (num1:number, num2:number){
        this.num1 = num1;
        this.num2 = num2;
    }
    result = () => this.num1 + this.num2;
}
