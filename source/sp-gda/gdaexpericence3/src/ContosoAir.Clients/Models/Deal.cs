namespace ContosoAir.Clients.Models
{
    public class Deal
    {
        public int Id { get; set; }
        public string CityName { get { return ToName; } }
        public string CityImage { get { return ToName; } }
        public double Price { get; set; }
        public string FromName { get; set; }
        public string FromCode { get; set; }
        public string DepartTime { get; set; }
        public string ArrivalTime { get; set; }
        public string Hours { get; set; }
        public string ToName { get; set; }
        public string ToCode { get; set; }
        public int Stops { get; set; }
    }
}