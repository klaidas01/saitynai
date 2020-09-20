using LibraryAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryAPI.Repositories.Interfaces
{
    public interface IBookRepository
    {
        public Task<List<Book>> GetAllBooks();
        public Task<Book> GetBook(int id);
        public Task DeleteBook(Book book);
        public Task UpdateBook(Book book);
        public Task<int> PostBook(Book book);
    }
}
