export class CustomerList {

  customerId:number = 0;
  firstName:String = 'string';
  lastName:String = 'string';
  address:String= 'string';
  zipCode:String= 'string';
  city:String= 'string';
  state:String= 'string';
  country:String = 'string';
  phone:String = 'string';
  email:String = 'string';
  sales:Number = 0;//
  registrationDate:string = '';
  registrationDateHidrated:Date = null;
  lastOrder:string = '';
  lastOrderHidrated:Date = null;

    hidrateDates() {
        this.lastOrderHidrated = new Date(this.lastOrder);
        this.registrationDateHidrated = new Date(this.registrationDate);
    }

    hidrate(json:CustomerList) {

      this.customerId = json.customerId;
      this.firstName = json.firstName;
      this.lastName  = json.lastName;
      this.email     = json.email;
      this.registrationDate = json.registrationDate;
      this.lastOrder = json.lastOrder;
      this.sales     = json.sales;

      this.hidrateDates();


    }

}
