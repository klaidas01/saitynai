using System;

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

        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
    }
}
