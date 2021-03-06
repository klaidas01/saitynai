﻿using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Models
{
    public class Library
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Address { get; set; }
    }
}
