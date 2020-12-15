using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.DTO
{
    public class RefreshTokenDTO
    {
        [Required]
        public string AccessToken { get; set; }
        [Required]
        public string RefreshToken { get; set; }
    }
}
