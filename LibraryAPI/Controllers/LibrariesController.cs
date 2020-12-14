using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryAPI.Models;
using LibraryAPI.Services.Interfaces;
using LibraryAPI.DTO;
using Microsoft.AspNetCore.Authorization;

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LibrariesController : ControllerBase
    {
        private readonly ILibraryService _libraryService;
        private readonly IBookService _bookService;

        public LibrariesController(ILibraryService libraryService, IBookService bookService)
        {
            _libraryService = libraryService;
            _bookService = bookService;
        }

        // GET: api/Libraries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Library>>> GetLibraries([FromQuery]SliceDTO slice)
        {
            var libraries = await _libraryService.GetSlice(slice.Page, slice.RowsPerPage, (slice.SearchTerm != null) ? slice.SearchTerm : "");
            return Ok(libraries);
        }

        // GET: api/Libraries/1/books
        [HttpGet("{libraryId}/books")]
        public async Task<ActionResult<Library>> GetLibraryBooks([FromQuery] SliceDTO slice, [FromRoute] int libraryId)
        {
            var library = await _libraryService.GetLibrary(libraryId);
            if (library == null)
            {
                return NotFound();
            }
            var books = await _bookService.GetLibrarySlice(slice.Page, slice.RowsPerPage, libraryId, (slice.SearchTerm != null) ? slice.SearchTerm : "");
            return Ok(books);
        }

        // GET: api/Libraries/1/books
        [HttpGet("{libraryId}/books/available")]
        public async Task<ActionResult<Library>> GetAvailableLibraryBooks([FromQuery] SliceDTO slice, [FromRoute] int libraryId)
        {
            var library = await _libraryService.GetLibrary(libraryId);
            if (library == null)
            {
                return NotFound();
            }
            var books = await _bookService.GetLibrarySlice(slice.Page, slice.RowsPerPage, libraryId, (slice.SearchTerm != null) ? slice.SearchTerm : "", false);
            return Ok(books);
        }

        // GET: api/Libraries/1/books/1
        [HttpGet("{libraryId}/books/{bookId}")]
        public async Task<ActionResult<Library>> GetLibraryBook([FromRoute] int libraryId, [FromRoute] int bookId)
        {
            var book = await _bookService.GetBook(bookId);
            if (book == null)
            {
                return NotFound();
            }
            if(libraryId != book.LibraryId)
            {
                return BadRequest();
            }

            return Ok(book);
        }

        // GET: api/Libraries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Library>> GetLibrary(int id)
        {
            var library = await _libraryService.GetLibrary(id);

            if (library == null)
            {
                return NotFound();
            }

            return Ok(library);
        }

        // PUT: api/Libraries/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> PutLibrary(int id, LibraryDTO library)
        {
            try
            {
                await _libraryService.UpdateLibrary(id, library);
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }
        }

        // POST: api/Libraries
        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Library>> PostLibrary(LibraryDTO library)
        {
            var libraryId = await _libraryService.PostLibrary(library);

            return CreatedAtAction("GetLibrary", new { id = libraryId }, library);
        }

        // DELETE: api/Libraries/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Library>> DeleteLibrary(int id)
        {
            try
            {
                var library = await _libraryService.DeleteLibrary(id);
                return Ok(library);
            }
            catch (ArgumentNullException)
            {
                return NotFound();
            }
        }
    }
}
