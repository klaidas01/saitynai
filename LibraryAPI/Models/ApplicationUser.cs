using Microsoft.AspNetCore.Identity;
using System;

namespace LibraryAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpirationDate { get; set; }

        //Employee has a library
        public virtual Library Library { get; set; }
        public int? LibraryId { get; set; }
    }
}
