using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryAPI.DTO
{
    public class ReservationDTO
    {
        [Required]
        public int BookId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime ReturnDate { get; set; }
        public bool IsReturned { get; set; }
    }
}
