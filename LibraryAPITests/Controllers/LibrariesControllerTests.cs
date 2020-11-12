using Xunit;
using LibraryAPI.Controllers;
using System;
using System.Collections.Generic;
using System.Text;
using LibraryAPI.Services.Interfaces;
using LibraryAPITests.Mock;
using Microsoft.AspNetCore.Mvc;
using LibraryAPI.Models;
using LibraryAPI.DTO;

namespace LibraryAPI.Controllers.Tests
{
    public class LibrariesControllerTests
    {
        LibrariesController controller;

        public LibrariesControllerTests()
        {
            var libService = MockLibraryService.GetMockLibraryServiceInstance();
            var bookService = new MockBookService();
            controller = new LibrariesController(libService.Object, bookService);
        }

        [Fact()]
        public void GetLibrariesTest()
        {
            //Act
            var result = controller.GetLibraries(new DTO.SliceDTO());

            //Assert
            Assert.IsType<OkObjectResult>(result.Result.Result);
            var items = Assert.IsType<ItemsDTO<Library>>((result.Result.Result as OkObjectResult).Value);
            Assert.Equal(3, items.items.Count);
        }

        [Fact()]
        public void GetLibraryBooksTestInvalidLibrary()
        {
            //Act
            var result = controller.GetLibraryBooks(new SliceDTO(), 999);

            //Assert
            Assert.IsType<NotFoundResult>(result.Result.Result);
        }

        [Fact()]
        public void GetLibraryBooksTest()
        {
            //Act
            var result = controller.GetLibraryBooks(new SliceDTO(), 1);

            //Assert
            Assert.IsType<OkObjectResult>(result.Result.Result);
            var items = Assert.IsType<List<Book>>((result.Result.Result as OkObjectResult).Value);
            Assert.Equal(2, items.Count);
        }

        [Fact()]
        public void GetLibraryBookTestInvalidBook()
        {
            //Act
            var result = controller.GetLibraryBook(1, 999);

            //Assert
            Assert.IsType<NotFoundResult>(result.Result.Result);
        }

        [Fact()]
        public void GetLibraryBookTestInvalidLibrary()
        {
            //Act
            var result = controller.GetLibraryBook(1, 3);

            //Assert
            Assert.IsType<BadRequestResult>(result.Result.Result);
        }

        [Fact()]
        public void GetLibraryBookTest()
        {
            //Act
            var result = controller.GetLibraryBook(1, 1);

            //Assert
            Assert.IsType<OkObjectResult>(result.Result.Result);
            Assert.IsType<Book>((result.Result.Result as OkObjectResult).Value);
        }

        [Fact()]
        public void GetLibraryTestInvalidLibrary()
        {
            //Act
            var result = controller.GetLibrary(999);

            //Assert
            Assert.IsType<NotFoundResult>(result.Result.Result);
        }

        [Fact()]
        public void GetLibraryTest()
        {
            //Act
            var result = controller.GetLibrary(1);

            //Assert
            Assert.IsType<OkObjectResult>(result.Result.Result);
            var library = Assert.IsType<Library>((result.Result.Result as OkObjectResult).Value);
            Assert.Equal(1, library.Id);
        }

        [Fact()]
        public void PutLibraryTestInvalidLibrary()
        {
            //Act
            var result = controller.PutLibrary(999, new DTO.LibraryDTO { Name = "name", Address = "address" });

            //Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact()]
        public void PutLibraryTest()
        {
            //Act
            var result = controller.PutLibrary(1, new DTO.LibraryDTO { Name = "name", Address = "address" });

            //Assert
            Assert.IsType<NoContentResult>(result.Result);
        }

        [Fact()]
        public void PostLibraryTest()
        {
            //Act
            var result = controller.PostLibrary(new DTO.LibraryDTO { Name = "name", Address = "address" });

            //Assert
            Assert.IsType<CreatedAtActionResult>(result.Result.Result);
        }

        [Fact()]
        public void DeleteLibraryTestInvalidLibrary()
        {
            //Act
            var result = controller.DeleteLibrary(999);

            //Assert
            Assert.IsType<NotFoundResult>(result.Result.Result);
        }

        [Fact()]
        public void DeleteLibraryTest()
        {
            //Act
            var result = controller.DeleteLibrary(1);

            //Assert
            Assert.IsType<OkObjectResult>(result.Result.Result);
            var library = Assert.IsType<Library>((result.Result.Result as OkObjectResult).Value);
            Assert.Equal(1, library.Id);
        }
    }
}