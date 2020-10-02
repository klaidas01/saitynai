using LibraryAPI.Context;
using LibraryAPI.Models;
using LibraryAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryAPI.Repositories
{
    public class BookRepository : IBookRepository
    {
        private readonly LibraryContext _context;

        public BookRepository(LibraryContext context)
        {
            _context = context;
        }

        public async Task<List<Book>> GetAllBooks()
        {
            var books = await _context.Books
                .Include(b => b.Library)
                .ToListAsync();

            return books;
        }

        public async Task<List<Book>> GetLibraryBooks(int libraryId)
        {
            var books = await _context.Books
                .Where(b => b.LibraryId == libraryId)
                .ToListAsync();

            return books;
        }

        public async Task<Book> GetBook(int id)
        {
            var book = await _context.Books
                .Include(b => b.Library)
                .Where(b => b.Id == id)
                .FirstOrDefaultAsync();

            return book;
        }

        public async Task DeleteBook(Book book)
        {
            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateBook(Book book)
        {
            _context.Entry(book).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task<int> PostBook(Book book)
        {
            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            return book.Id;
        }
    }
}
