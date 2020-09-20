using LibraryAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryAPI.Repositories.Interfaces
{
    public interface ILibraryRepository
    {
        public Task<List<Library>> GetAllLibraries();
        public Task<Library> GetLibrary(int id);
        public Task DeleteLibrary(Library library);
        public Task UpdateLibrary(Library library);
        public Task<int> PostLibrary(Library library);
    }
}
