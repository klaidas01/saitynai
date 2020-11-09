using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryAPI.DTO
{
    public class ItemsDTO<T>
    {
        public IList<T> items { get; set; }
        public int count { get; set; }
    }
}
