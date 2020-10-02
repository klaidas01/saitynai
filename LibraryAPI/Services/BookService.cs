using LibraryAPI.DTO;
using LibraryAPI.Models;
using LibraryAPI.Repositories.Interfaces;
using LibraryAPI.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace LibraryAPI.Services
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _repo;
        private readonly UserManager<ApplicationUser> _userManager;

        public BookService(IBookRepository repo, UserManager<ApplicationUser> userManager)
        {
            _repo = repo;
            _userManager = userManager;
        }

        public async Task<List<Book>> GetBooks()
        {
            var books = await _repo.GetAllBooks();
            return books;
        }

        public async Task<List<Book>> GetLibraryBooks(int libraryId)
        {
            var books = await _repo.GetLibraryBooks(libraryId);
            return books;
        }

        public async Task<Book> GetBook(int id)
        {
            var book = await _repo.GetBook(id);
            return book;
        }

        public async Task<int> PostBook(BookDTO book, string userName, string role)
        {
            if (role == "Employee")
            {
                var user = await _userManager.FindByNameAsync(userName);
                if (user.LibraryId != book.LibraryId)
                    throw new UnauthorizedAccessException();
            }
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

        public async Task<Book> DeleteBook(int id, string userName, string role)
        {
            var book = await _repo.GetBook(id);
            if (role == "Employee")
            {
                var user = await _userManager.FindByNameAsync(userName);
                if (user.LibraryId != book.LibraryId)
                    throw new UnauthorizedAccessException();
            }
            await _repo.DeleteBook(book);
            return book;
        }

        public async Task<int> UpdateBook(int id, BookDTO book, string userName, string role)
        {
            if (role == "Employee")
            {
                var user = await _userManager.FindByNameAsync(userName);
                var oldBook = await _repo.GetBook(id);
                if (user.LibraryId != oldBook.LibraryId || user.LibraryId != book.LibraryId)
                    throw new UnauthorizedAccessException();
            }
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
