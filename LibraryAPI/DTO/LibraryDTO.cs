using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.DTO
{
    public class LibraryDTO
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Address { get; set; }


    }
}
