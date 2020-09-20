using LibraryAPI.DTO;
using LibraryAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryAPI.Services.Interfaces
{
    public interface ILibraryService
    {
        public Task<List<Library>> GetLibraries();
        public Task<Library> GetLibrary(int id);
        public Task<int> PostLibrary(LibraryDTO library);
        public Task<Library> DeleteLibrary(int id);
        public Task<int> UpdateLibrary(int id, LibraryDTO library);
    }
}
