﻿using System;
using System.Collections.Generic;
using System.Linq;
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

        public LibrariesController(ILibraryService libraryService)
        {
            _libraryService = libraryService;
        }

        // GET: api/Libraries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Library>>> GetLibraries()
        {
            var libraries = await _libraryService.GetLibraries();
            return Ok(libraries);
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
