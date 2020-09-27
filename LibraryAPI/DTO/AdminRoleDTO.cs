using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryAPI.DTO
{
    public class AdminRoleDTO
    {
        [Required]
        public string UserName { get; set; }
    }
}
