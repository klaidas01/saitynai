using LibraryAPI.DTO;
using LibraryAPI.Models;
using LibraryAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace LibraryAPITests.Mock
{
    public static class MockLibraryService
    {
        public static Mock<ILibraryService> GetMockLibraryServiceInstance()
        {
            var mock = new Mock<ILibraryService>();

            mock.Setup(service => service.GetLibraries()).Returns(Task.FromResult(new List<Library> {
            new Library {Id = 1, Name = "Name 1", Address = "Address 1"},
            new Library {Id = 2, Name = "Name 2", Address = "Address 2"},
            new Library {Id = 3, Name = "Name 3", Address = "Address 3"}
            }));

            mock.Setup(service => service.GetLibrary(It.IsInRange<int>(1, 3, Moq.Range.Inclusive))).Returns((int id) => Task.FromResult(new Library { Id = id, Name = "Name 1", Address = "Address 1" }));
            mock.Setup(service => service.GetLibrary(It.Is<int>(i => i > 3 || i < 1))).Returns(Task.FromResult<Library>(null));

            mock.Setup(service => service.UpdateLibrary(It.IsInRange<int>(1, 3, Moq.Range.Inclusive), It.IsAny<LibraryDTO>())).Returns((int id, LibraryDTO dto) => Task.FromResult(id));
            mock.Setup(service => service.UpdateLibrary(It.Is<int>(i => i > 3 || i < 1), It.IsAny<LibraryDTO>())).Throws(new DbUpdateConcurrencyException());

            mock.Setup(service => service.PostLibrary(It.IsAny<LibraryDTO>())).Returns((LibraryDTO dto) => Task.FromResult(4));

            mock.Setup(service => service.DeleteLibrary(It.IsInRange<int>(1, 3, Moq.Range.Inclusive))).Returns((int id) => Task.FromResult(new Library { Id = id, Name = "Name 1", Address = "Address 1" }));
            mock.Setup(service => service.DeleteLibrary(It.Is<int>(i => i > 3 || i < 1))).Throws(new ArgumentNullException());

            return mock;
        }
    }
}
