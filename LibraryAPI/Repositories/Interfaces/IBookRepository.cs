using LibraryAPI.DTO;
using LibraryAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryAPI.Repositories.Interfaces
{
    public interface IBookRepository
    {
        public Task<List<Book>> GetAllBooks();
        public Task<List<Book>> GetLibraryBooks(int libraryId);
        public Task<ItemsDTO<Book>> GetSlice(int page, int rowsPerPage, string searchTerm);
        public Task<ItemsDTO<Book>> GetLibrarySlice(int page, int rowsPerPage, int libraryId, string searchTerm);
        public Task<Book> GetBook(int id);
        public Task<Book> GetUntrackedBook(int id);
        public Task DeleteBook(Book book);
        public Task UpdateBook(Book book);
        public Task<int> PostBook(Book book);
    }
}
