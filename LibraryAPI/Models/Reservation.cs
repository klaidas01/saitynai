using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Permissions;
using System.Threading.Tasks;

namespace LibraryAPI.Models
{
    public class Reservation
    {
        public int Id { get; set; }

        public int BookId { get; set; }
        public Book Book { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime ReturnDate { get; set; }
        public bool IsReturned { get; set; }
    }
}
