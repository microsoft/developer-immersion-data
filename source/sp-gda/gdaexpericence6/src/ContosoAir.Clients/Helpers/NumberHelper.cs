namespace ContosoAir.Clients.Helpers
{
    public class NumberHelper
    {
        static string[] Numbers = new string[] { "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten" };

        public static string GetNumberName(int index)
        {
            return Numbers[index];
        }
    }
}