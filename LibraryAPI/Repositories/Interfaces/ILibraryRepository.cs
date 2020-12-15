using LibraryAPI.DTO;
using LibraryAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryAPI.Repositories.Interfaces
{
    public interface ILibraryRepository
    {
        public Task<List<Library>> GetAllLibraries();
        public Task<ItemsDTO<Library>> GetSlice(int page, int rowsPerPage, string searchTerm);
        public Task<Library> GetLibrary(int id);
        public Task DeleteLibrary(Library library);
        public Task UpdateLibrary(Library library);
        public Task<int> PostLibrary(Library library);
    }
}
