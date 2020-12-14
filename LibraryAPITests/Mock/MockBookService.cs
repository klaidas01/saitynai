using LibraryAPI.DTO;
using LibraryAPI.Models;
using LibraryAPI.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace LibraryAPITests.Mock
{
    class MockBookService : IBookService
    {
        private List<Book> repo;


        public MockBookService()
        {
            repo = new List<Book> { new Book { Id = 1, Author = "Author 1", Description = "Description 1", Title = "Title 1", LibraryId = 1, PageCount = 101 },
                                    new Book { Id = 2, Author = "Author 2", Description = "Description 2", Title = "Title 2", LibraryId = 1, PageCount = 308 },
                                    new Book { Id = 3, Author = "Author 3", Description = "Description 3", Title = "Title 3", LibraryId = 2, PageCount = 258 }
            };
        }

        public Task<Book> DeleteBook(int id, ClaimsPrincipal u)
        {
            var book = repo.FirstOrDefault(b => b.Id == id);
            if (book == null) throw new ArgumentNullException();
            repo.Remove(book);
            return Task.FromResult(book);
        }

        public Task<Book> GetBook(int id)
        {
            return Task.FromResult(repo.FirstOrDefault(b => b.Id == id));
        }

        public Task<List<Book>> GetBooks()
        {
            return Task.FromResult(repo);
        }

        public Task<List<Book>> GetLibraryBooks(int libraryId)
        {
            return Task.FromResult(repo.Where(b => b.LibraryId == libraryId).ToList());
        }

        public Task<ItemsDTO<Book>> GetLibrarySlice(int page, int rowsPerPage, int libraryId, string searchTerm = "")
        {
            throw new NotImplementedException();
        }

        public Task<ItemsDTO<Book>> GetLibrarySlice(int page, int rowsPerPage, int libraryId, string searchTerm = "", bool includeReserved = true)
        {
            throw new NotImplementedException();
        }

        public Task<ItemsDTO<Book>> GetSlice(int page, int rowsPerPage, string searchTerm = "")
        {
            throw new NotImplementedException();
        }

        public Task<ItemsDTO<Book>> GetSlice(int page, int rowsPerPage, string searchTerm = "", bool includeReserved = true)
        {
            throw new NotImplementedException();
        }

        public Task<int> PostBook(BookDTO book, ClaimsPrincipal u)
        {
            var newBook = new Book
            {
                Id = 4,
                Title = book.Title,
                Author = book.Author,
                PageCount = (int)book.PageCount,
                Description = book.Description,
                LibraryId = book.LibraryId,
                IsReserved = book.IsReserved
            };

            repo.Add(newBook);

            return Task.FromResult(newBook.Id);
        }

        public Task<int> UpdateBook(int id, BookDTO book, ClaimsPrincipal user)
        {
            var oldBook = repo.FirstOrDefault(b => b.Id == id);
            if (oldBook == null) throw new KeyNotFoundException();
            var newBook = new Book
            {
                Id = oldBook.Id,
                Title = book.Title,
                Author = book.Author,
                PageCount = (int)book.PageCount,
                Description = book.Description,
                LibraryId = book.LibraryId,
                IsReserved = book.IsReserved
            };
            repo.Remove(oldBook);
            repo.Add(newBook);

            return Task.FromResult(id);
        }

    }
}
