using System.Collections.Generic;

namespace ContosoAir.Clients.Models
{
    public class SoloService
    {
        // ---- Properties for Source SoloService Provider -------

        public string Id { get; set; }

        public string Airline_Name { get; set; }

        public string End_Date = "2017-08-31";

        public string From_Code = "BCN";

        public string To_Code = "SEA";
        //public string End_Date { get; set; }
        //public string From_Code { get; set; }
        //public string To_Code { get; set; }

        public string First_Name { get; set; }

        public string Last_Name { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public string Country { get; set; }

        public string State { get; set; }

        public string Zip { get; set; }

        public string Phone1 { get; set; }

        public string Phone2 { get; set; }

        public string Email { get; set; }

        public float Score { get; set; }

        public byte[] Photo { get; set; }

        public List<Reviews> Reviews { get; set; }
    }

}
