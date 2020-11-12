using LibraryAPI.DTO;
using LibraryAPI.Models;
using LibraryAPI.Repositories.Interfaces;
using LibraryAPI.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.CompilerServices;
using System.Security.Claims;
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

        public async Task<ItemsDTO<Book>> GetSlice(int page, int rowsPerPage, string searchTerm = "")
        {
            var books = await _repo.GetSlice(page, rowsPerPage, searchTerm);
            return books;
        }

        public async Task<ItemsDTO<Book>> GetLibrarySlice(int page, int rowsPerPage, int libraryId, string searchTerm = "")
        {
            var books = await _repo.GetLibrarySlice(page, rowsPerPage, libraryId, searchTerm);
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

        public async Task<int> PostBook(BookDTO book, ClaimsPrincipal u)
        {
            var role = u.FindFirst(ClaimTypes.Role).Value;
            var userName = u.FindFirstValue(ClaimTypes.NameIdentifier);
            if (role == "Employee")
            {
                var user = await _userManager.FindByNameAsync(userName);
                if (user.LibraryId != book.LibraryId)
                    throw new UnauthorizedAccessException();
            }
            var byteStream = (book.coverImage != null) ? await GetBytes(book.coverImage) : null;
            var id = await _repo.PostBook(new Book { 
                Title = book.Title,
                Author = book.Author,
                PageCount = (int)book.PageCount,
                Description = book.Description,
                LibraryId = book.LibraryId,
                IsReserved = false,
                CoverImage = byteStream
            });
            return id;
        }

        public async Task<Book> DeleteBook(int id, ClaimsPrincipal u)
        {
            var role = u.FindFirst(ClaimTypes.Role).Value;
            var userName = u.FindFirstValue(ClaimTypes.NameIdentifier);
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

        public async Task<int> UpdateBook(int id, BookDTO book, ClaimsPrincipal u)
        {
            var role = u.FindFirst(ClaimTypes.Role).Value;
            var userName = u.FindFirstValue(ClaimTypes.NameIdentifier);
            var oldBook = await _repo.GetUntrackedBook(id);
            if (oldBook == null)
            {
                throw new KeyNotFoundException();
            }
            if (role == "Employee")
            {
                var user = await _userManager.FindByNameAsync(userName);
                if (user.LibraryId != oldBook.LibraryId || user.LibraryId != book.LibraryId)
                    throw new UnauthorizedAccessException();
            }
            await _repo.UpdateBook(new Book
            {
                Id = id,
                Title = book.Title,
                Author = book.Author,
                PageCount = (int)book.PageCount,
                Description = book.Description,
                LibraryId = book.LibraryId,
                IsReserved = book.IsReserved
            });
            return id;
        }

        public async Task<byte[]> GetBytes(IFormFile formFile)
        {
            using (var memoryStream = new MemoryStream())
            {
                await formFile.CopyToAsync(memoryStream);
                return memoryStream.ToArray();
            }
        }
    }
}
