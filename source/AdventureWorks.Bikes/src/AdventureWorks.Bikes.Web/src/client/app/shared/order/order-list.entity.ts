

export class OrderList {

    orderId:number = 0;
    totalPrice:number = 0;
    date:string = '';
    dateHidrated:Date = null;
    status:String = 'Unknown';
    customer:String = 'Unknown';
    delivery:String = 'Unknown';
    payment:String = 'Unknown';

    hidrateDates() {
        this.dateHidrated = new Date(this.date);
    }

    hidrate(json:OrderList) {

      this.orderId = json.orderId;
      this.customer = json.customer;
      this.date  = json.date;
      this.payment     = json.payment;
      this.delivery = json.delivery;
      this.status = json.status;
      this.totalPrice     = json.totalPrice;

      this.hidrateDates();


    }

}
