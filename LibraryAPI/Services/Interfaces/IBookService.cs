using LibraryAPI.DTO;
using LibraryAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryAPI.Services.Interfaces
{
    public interface IBookService
    {
        public Task<List<Book>> GetBooks();
        public Task<Book> GetBook(int id);
        public Task<int> PostBook(BookDTO book);
        public Task<Book> DeleteBook(int id);
        public Task<int> UpdateBook(int id, BookDTO book);
    }
}
