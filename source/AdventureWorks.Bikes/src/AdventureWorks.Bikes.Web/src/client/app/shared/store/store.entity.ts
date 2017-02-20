import { Product } from '../product/product.entity';

export class Store {

    constructor(
        public storeId:number      = null,
        public name:String    = '',
        public description:String = '',
        public products:Product[] = [],
        public address:String = '',
        public distance:number = 0,
        public city:String     = '',
        public state:String    = '',
        public country:String  = '') {
	};



}
