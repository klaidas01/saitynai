using LibraryAPI.DTO;
using LibraryAPI.Models;
using LibraryAPI.Repositories.Interfaces;
using LibraryAPI.Services.Interfaces;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace LibraryAPI.Services
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _repo;

        public BookService(IBookRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<Book>> GetBooks()
        {
            var books = await _repo.GetAllBooks();
            return books;
        }

        public async Task<Book> GetBook(int id)
        {
            var book = await _repo.GetBook(id);
            return book;
        }

        public async Task<int> PostBook(BookDTO book)
        {
            var id = await _repo.PostBook(new Book { 
                Title = book.Title,
                Author = book.Author,
                Rating = book.Rating,
                PageCount = book.PageCount,
                Description = book.Description,
                LibraryId = book.LibraryId,
                IsReserved = false
            });
            return id;
        }

        public async Task<Book> DeleteBook(int id)
        {
            var book = await _repo.GetBook(id);
            await _repo.DeleteBook(book);
            return book;
        }

        public async Task<int> UpdateBook(int id, BookDTO book)
        {
            await _repo.UpdateBook(new Book
            {
                Title = book.Title,
                Author = book.Author,
                Rating = book.Rating,
                PageCount = book.PageCount,
                Description = book.Description,
                LibraryId = book.LibraryId,
                IsReserved = book.IsReserved
            });
            return id;
        }
    }
}
