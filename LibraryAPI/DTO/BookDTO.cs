using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryAPI.DTO
{
    public class BookDTO
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Author { get; set; }

        [Required]
        [Range(0.1, 10,
        ErrorMessage = "Value for {0} must be between {1} and {2}.")]
        public double? Rating { get; set; }

        [Required]
        [Range(1, Double.PositiveInfinity,
        ErrorMessage = "Value for {0} must be more than 0")]
        public int? PageCount { get; set; }

        [Required]
        public string Description { get; set; }

        public bool IsReserved { get; set; }

        [Required]
        public int LibraryId { get; set; }
    }
}
