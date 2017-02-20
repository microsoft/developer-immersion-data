import { Store } from '../store/store.entity';

export class Product {

    constructor(
        public productId:number=null,
        public name:String='',
        public originalPrice:number=0,
        public finalPrice:number=0,
        public discount:number=0,
        public storeId:number=null,
        public storeName:string='',
        public store:Store=null,
        public description:String='',
        public remainingUnits:number=0,
        public specs:String[]=[]) {
    };

}
