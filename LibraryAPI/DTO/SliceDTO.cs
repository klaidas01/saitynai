using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.DTO
{
    public class SliceDTO
    {
        [BindRequired]
        public int Page { get; set; }
        [BindRequired]
        [Range(1, 40)]
        public int RowsPerPage { get; set; }

        public string SearchTerm { get; set; }
    }
}
