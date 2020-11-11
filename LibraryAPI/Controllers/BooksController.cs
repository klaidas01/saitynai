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
            try
            {
                await _bookService.UpdateBook(id, book, User);
                return NoContent();
            }
            catch (DbUpdateException)
            {
                return BadRequest($"There is no library with id {book.LibraryId}");
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403);
            }
        }

        // POST: api/Books
        [HttpPost]
        [Authorize(Roles = "Administrator,Employee")]
        public async Task<ActionResult<BookDTO>> PostBook([FromForm]BookDTO book)
        {
            try
            {
                var bookId = await _bookService.PostBook(book, User);

                return CreatedAtAction("GetBook", new { id = bookId }, book);
            }
            catch (DbUpdateException)
            {
                return BadRequest($"No library with id {book.LibraryId}");
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403);
            }
        }

        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator,Employee")]
        public async Task<ActionResult<Book>> DeleteBook(int id)
        {
            try
            {
                var book = await _bookService.DeleteBook(id, User);
                return Ok(book);
            }
            catch (ArgumentNullException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403);
            }
        }
    }
}
