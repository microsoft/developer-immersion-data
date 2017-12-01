namespace ContosoAir.Clients.Models
{
    public class Flight
    {
        public int Id { get; set; }
        public string Title { get { return string.Format("{0} to {1}", FromName, ToName); } }
        public string PassengerName { get; set; }
        public string CityName { get { return ToName; } }
        public string CityImage { get { return ToName; } }
        public string FromName { get; set; }
        public string FromCode { get; set; }
        public string DepartDate { get; set; }
        public string DepartTime { get; set; }
        public string BoardingTime { get; set; }
        public string ToName { get; set; }
        public string ToCode { get; set; }
        public string Seat { get; set; }
        public string Terminal { get; set; }
        public string Gate { get; set; }
    }
}