using LibraryAPI.Context;
using LibraryAPI.DTO;
using LibraryAPI.Models;
using LibraryAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryAPI.Repositories
{
    public class LibraryRepository : ILibraryRepository
    {
        private readonly LibraryContext _context;

        public LibraryRepository(LibraryContext context)
        {
            _context = context;
        }

        public async Task<List<Library>> GetAllLibraries()
        {
            var libraries = await _context.Libraries
                .ToListAsync();

            return libraries;
        }

        public async Task<ItemsDTO<Library>> GetSlice(int page, int rowsPerPage, string searchTerm)
        {
            var count = _context.Libraries.Count(l => l.Name.ToLower().Contains(searchTerm.ToLower()));

            var libraries = await _context.Libraries
                .OrderBy(l => l.Name)
                .Where(l => l.Name.ToLower().Contains(searchTerm.ToLower()))
                .Skip((page) * rowsPerPage)
                .Take(rowsPerPage)
                .ToListAsync();

            return new ItemsDTO<Library> { items = libraries, count = count };
        }

        public async Task<Library> GetLibrary(int id)
        {
            var library = await _context.Libraries
                .Where(l => l.Id == id)
                .FirstOrDefaultAsync();

            return library;
        }

        public async Task DeleteLibrary(Library library)
        {
            _context.Libraries.Remove(library);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateLibrary(Library library)
        {
            _context.Entry(library).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task<int> PostLibrary(Library library)
        {
            _context.Libraries.Add(library);
            await _context.SaveChangesAsync();
            return library.Id;
        }
    }
}
