using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryAPI.Models;
using LibraryAPI.Services.Interfaces;
using LibraryAPI.DTO;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BooksController(IBookService bookService)
        {
            _bookService = bookService;
        }

        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            var books = await _bookService.GetBooks();
            return Ok(books);
        }

        // GET: api/Books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _bookService.GetBook(id);

            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        // PUT: api/Books/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator,Employee")]
        public async Task<IActionResult> PutBook(int id, BookDTO book)
        {
            var role = this.User.FindFirst(ClaimTypes.Role).Value;
            var userName = User.FindFirstValue(ClaimTypes.NameIdentifier);
            try
            {
                await _bookService.UpdateBook(id, book, userName, role);
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        // POST: api/Books
        [HttpPost]
        [Authorize(Roles = "Administrator,Employee")]
        public async Task<ActionResult<Book>> PostBook(BookDTO book)
        {
            var role = this.User.FindFirst(ClaimTypes.Role).Value;
            var userName = User.FindFirstValue(ClaimTypes.NameIdentifier);
            try
            {
                var bookId = await _bookService.PostBook(book, userName, role);

                return CreatedAtAction("GetBook", new { id = bookId }, book);
            }
            catch (DbUpdateException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator,Employee")]
        public async Task<ActionResult<Book>> DeleteBook(int id)
        {
            var role = this.User.FindFirst(ClaimTypes.Role).Value;
            var userName = User.FindFirstValue(ClaimTypes.NameIdentifier);
            try
            {
                var book = await _bookService.DeleteBook(id, userName, role);
                return Ok(book);
            }
            catch (ArgumentNullException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }
    }
}
