using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.DTO
{
    public class EmployeeRoleDTO
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public int LibraryId { get; set; }
    }
}
