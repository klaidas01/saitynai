using System.Collections.Generic;

namespace LibraryAPI.DTO
{
    public class ItemsDTO<T>
    {
        public IList<T> items { get; set; }
        public int count { get; set; }
    }
}
