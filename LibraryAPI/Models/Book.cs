using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryAPI.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public int PageCount { get; set; }
        public string Description { get; set; }
        public Boolean IsReserved { get; set; }
        public byte[] CoverImage { get; set; }
        public double? LateFee { get; set; }

        public int? LibraryId { get; set; }
        public Library Library { get; set; }
    }
}
