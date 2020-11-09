using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryAPI.DTO
{
    public class SliceDTO
    {
        [BindRequired]
        public int Page { get; set; }
        [BindRequired]
        public int RowsPerPage { get; set; }

        public string SearchTerm { get; set; }
    }
}
