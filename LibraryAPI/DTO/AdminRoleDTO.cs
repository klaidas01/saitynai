using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.DTO
{
    public class AdminRoleDTO
    {
        [Required]
        public string UserName { get; set; }
    }
}
