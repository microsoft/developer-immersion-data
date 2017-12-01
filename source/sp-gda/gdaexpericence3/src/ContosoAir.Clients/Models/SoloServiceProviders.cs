using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ContosoAir.Clients.Models
{
    public class SoloServiceProviders
    {
        // ---- Properties for Source SoloService Provider -------
        public bool EntryVisible { get; set; }

        public bool ShowHideIcon { get;  set; }

        public string Source_SoloService_AirlineName { get; set; }

        public string Source_SoloService_End_Date { get; set; }

        public string Source_SoloService_Code { get; set; }        

        public string Source_SoloService_Name { get; set; }

        public string Source_SoloService_Address { get; set; }

        public string Source_SoloService_City { get; set; }

        public string Source_SoloService_State { get; set; }

        public string Source_SoloService_Country { get; set; }

        public string Source_SoloService_Zip { get; set; }

        public string Source_SoloService_Phone_1 { get; set; }

        public string Source_SoloService_Phone_2 { get; set; }

        public float Source_SoloService_Score { get; set; }

        public byte[] Source_SoloService_Photo { get; set; }

        public List<Reviews> Source_SoloService_Reviews { get; set; }

        // ---- Properties for Destination SoloService Provider -------

        public string Dest_SoloService_AirlineName { get; set; }

        public string Dest_SoloService_End_Date { get; set; }

        public string Dest_SoloService_Code { get; set; }
        
        public string Dest_SoloService_Name { get; set; }

        public string Dest_SoloService_Address { get; set; }

        public string Dest_SoloService_City { get; set; }

        public string Dest_SoloService_State { get; set; }

        public string Dest_SoloService_Country { get; set; }

        public string Dest_SoloService_Zip { get; set; }

        public string Dest_SoloService_Phone_1 { get; set; }

        public string Dest_SoloService_Phone_2 { get; set; }

        public float Dest_SoloService_Score { get; set; }

        public byte[] Dest_SoloService_Photo { get; set; }

        public List<Reviews> Dest_SoloService_Reviews { get; set; }
        
    }
    
}
