using LibraryAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryAPI.DTO
{
    public class ReservationResponse
    {
        public int Id { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public bool IsReturned { get; set; }
        public string State { get; set; }
        public double? LateFee { get; set; }
        public string UserName { get; set; }
        public string BookName { get; set; }
        public string LibraryName { get; set; }
        public int? LibraryId { get; set; }
    }
}
