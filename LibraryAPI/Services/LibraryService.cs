using LibraryAPI.DTO;
using LibraryAPI.Models;
using LibraryAPI.Repositories.Interfaces;
using LibraryAPI.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryAPI.Services
{
    public class LibraryService : ILibraryService
    {
        private readonly ILibraryRepository _repo;

        public LibraryService(ILibraryRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<Library>> GetLibraries()
        {
            var libraries = await _repo.GetAllLibraries();
            return libraries;
        }

        public async Task<ItemsDTO<Library>> GetSlice(int page, int rowsPerPage, string searchTerm = "")
        {
            var libraries = await _repo.GetSlice(page, rowsPerPage, searchTerm);
            return libraries;
        }

        public async Task<Library> GetLibrary(int id)
        {
            var library = await _repo.GetLibrary(id);
            return library;
        }

        public async Task<int> PostLibrary(LibraryDTO library)
        {
            var id = await _repo.PostLibrary(new Library { Name = library.Name, Address = library.Address });
            return id;
        }

        public async Task<Library> DeleteLibrary(int id)
        {

            var library = await _repo.GetLibrary(id);
            await _repo.DeleteLibrary(library);
            return library;
        }

        public async Task<int> UpdateLibrary(int id, LibraryDTO library)
        {
            await _repo.UpdateLibrary(new Library { Id = id, Name = library.Name, Address = library.Address });
            return id;
        }
    }
}
