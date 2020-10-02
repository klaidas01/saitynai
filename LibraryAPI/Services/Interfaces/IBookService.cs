using LibraryAPI.DTO;
using LibraryAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryAPI.Services.Interfaces
{
    public interface IBookService
    {
        public Task<List<Book>> GetBooks();
        public Task<List<Book>> GetLibraryBooks(int libraryId);
        public Task<Book> GetBook(int id);
        public Task<int> PostBook(BookDTO book, string userName, string role);
        public Task<Book> DeleteBook(int id, string userName, string role);
        public Task<int> UpdateBook(int id, BookDTO book, string userName, string role);
    }
}
