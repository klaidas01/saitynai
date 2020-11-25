using LibraryAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryAPI.DTO
{
    public class SingleReservationResponse
    {
        public Reservation reservation { get; set; }
        public string UserName { get; set; }
    }
}
