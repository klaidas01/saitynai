using LibraryAPI.DTO;
using LibraryAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryAPI.Services.Interfaces
{
    public interface ILibraryService
    {
        public Task<List<Library>> GetLibraries();
        public Task<ItemsDTO<Library>> GetSlice(int page, int rowsPerPage, string searchTerm = "");
        public Task<Library> GetLibrary(int id);
        public Task<int> PostLibrary(LibraryDTO library);
        public Task<Library> DeleteLibrary(int id);
        public Task<int> UpdateLibrary(int id, LibraryDTO library);
    }
}
