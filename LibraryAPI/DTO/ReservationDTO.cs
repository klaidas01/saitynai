using System;
using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.DTO
{
    public class ReservationDTO
    {
        [Required]
        public int? BookId { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public DateTime? StartDate { get; set; }

        [Required]
        public DateTime? ReturnDate { get; set; }

        public bool IsReturned { get; set; }
    }
}
