using LibraryAPI.DTO;
using LibraryAPI.Models;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace LibraryAPI.Services.Interfaces
{
    public interface IBookService
    {
        public Task<List<Book>> GetBooks();
        public Task<List<Book>> GetLibraryBooks(int libraryId);
        public Task<ItemsDTO<Book>> GetSlice(int page, int rowsPerPage, string searchTerm = "", bool includeReserved = true);
        public Task<ItemsDTO<Book>> GetLibrarySlice(int page, int rowsPerPage, int libraryId, string searchTerm = "", bool includeReserved = true);
        public Task<Book> GetBook(int id);
        public Task<int> PostBook(BookDTO book,  ClaimsPrincipal user);
        public Task<Book> DeleteBook(int id, ClaimsPrincipal user);
        public Task<int> UpdateBook(int id, BookDTO book, ClaimsPrincipal user);
    }
}
