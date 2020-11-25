using LibraryAPI.Controllers;
using LibraryAPI.DTO;
using LibraryAPI.Models;
using LibraryAPI.Services.Interfaces;
using LibraryAPITests.Mock;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using Xunit;

namespace LibraryAPITests.ControllerUnitTests
{
    public class BooksControllerTest
    {
        BooksController controller;
        IBookService service;

        public BooksControllerTest()
        {
            service = new MockBookService();
            controller = new BooksController(service);
        }

        [Fact]
        public void GetBooks_WhenCalled_ReturnsOkResult()
        {
            // Act
            var okResult = controller.GetBooks(new SliceDTO());

            // Assert
            Assert.IsType<OkObjectResult>(okResult.Result.Result);
        }

        [Fact]
        public void GetBooks_WhenCalled_ReturnsAllBooks()
        {
            // Act
            var okResult = controller.GetBooks(new SliceDTO()).Result.Result as OkObjectResult;

            // Assert
            var items = Assert.IsType<List<Book>>(okResult.Value);
            Assert.Equal(3, items.Count);
        }

        [Fact]
        public void GetBook_UnknownIdPassed_ReturnsNotFoundResult()
        {
            // Act
            var notFoundResult = controller.GetBook(4);
            // Assert
            Assert.IsType<NotFoundResult>(notFoundResult.Result.Result);
        }

        [Fact]
        public void GetBook_ExistingIdPassed_ReturnsOkResult()
        {
            // Act
            var okResult = controller.GetBook(1);

            // Assert
            Assert.IsType<OkObjectResult>(okResult.Result.Result);
        }

        [Fact]
        public void GetBook_ExistingIdPassed_ReturnsCorrectItem()
        {
            // Act
            var okResult = controller.GetBook(1).Result.Result as OkObjectResult;

            // Assert
            Assert.IsType<Book>(okResult.Value);
            Assert.Equal(1, (okResult.Value as Book).Id);
        }

        [Fact]
        public void BookWithMissingRequiredFields_ThrowsError()
        {
            //Arrange
            var subject = new BookDTO { 
                
            };

            //Act
            var results = ValidateModel(subject);

            //Assert
            Assert.True(results.Count > 0);
            Assert.Contains(results, v => v.MemberNames.Contains("Title"));
            Assert.Contains(results, v => v.MemberNames.Contains("Author"));
            Assert.Contains(results, v => v.MemberNames.Contains("Rating"));
            Assert.Contains(results, v => v.MemberNames.Contains("PageCount"));
            Assert.Contains(results, v => v.MemberNames.Contains("Description"));
        }

        [Fact]
        public void BookWithInvalidRating_ThrowsError()
        {
            //Arrange
            var subject1 = new BookDTO
            {
                Title = "test",
                Author = "test",
                Description = "test",
                PageCount = 100,
                LibraryId = 1
            };
            var subject2 = new BookDTO
            {
                Title = "test",
                Author = "test",
                Description = "test",
                PageCount = 100,
                LibraryId = 1
            };

            //Act
            var results1 = ValidateModel(subject1);
            var results2 = ValidateModel(subject2);

            //Assert
            Assert.Contains(results1, v => v.MemberNames.Contains("Rating"));
            Assert.Contains(results2, v => v.MemberNames.Contains("Rating"));
            Assert.True(results1.Count == 1);
            Assert.True(results2.Count == 1);
        }

        [Fact]
        public void BookWithInvalidPageCount_ThrowsError()
        {
            //Arrange
            var subject = new BookDTO
            {
                Title = "test",
                Author = "test",
                Description = "test",
                PageCount = -100,
                LibraryId = 1
            };

            //Act
            var results = ValidateModel(subject);

            //Assert
            Assert.Contains(results, v => v.MemberNames.Contains("PageCount"));
            Assert.True(results.Count == 1);
        }

        [Fact]
        public void ValidBook_DoesNotThrowError()
        {
            //Arrange
            var subject = new BookDTO
            {
                Title = "test",
                Author = "test",
                Description = "test",
                PageCount = 100,
                LibraryId = 1
            };

            //Act
            var results = ValidateModel(subject);

            //Assert
            Assert.True(results.Count == 0);
        }

        [Fact]
        public void PostBook_ValidBookPassed_ReturnsCreatedAtAction()
        {
            // Arrange
            var newBook = new BookDTO()
            {
                Title = "test",
                Author = "test",
                Description = "test",
                PageCount = 100,
                LibraryId = 1
            };

            // Act
            var badResponse = controller.PostBook(newBook);

            // Assert
            Assert.IsType<CreatedAtActionResult>(badResponse.Result.Result);
        }

        [Fact]
        public void Add_ValidBookPassed_ReturnedResponseHasCreatedBook()
        {
            // Arrange
            var testItem = new BookDTO()
            {
                Title = "test",
                Author = "test",
                Description = "test",
                PageCount = 100,
                LibraryId = 1
            };
            // Act
            var createdResponse = controller.PostBook(testItem).Result.Result as CreatedAtActionResult;
            // Assert
            Assert.IsType<BookDTO>(createdResponse.Value);
            Assert.Equal("test", (createdResponse.Value as BookDTO).Title);
        }

        [Fact]
        public void DeleteBook_NotExistingIdPassed_ReturnsNotFoundResponse()
        {
            // Act
            var badResponse = controller.DeleteBook(4);
            // Assert
            Assert.IsType<NotFoundResult>(badResponse.Result.Result);
        }

        [Fact]
        public void DeleteBook_ExistingIdPassed_ReturnsOkResult()
        {
            // Act
            var okResponse = controller.DeleteBook(1);
            // Assert
            Assert.IsType<OkObjectResult>(okResponse.Result.Result);
        }

        [Fact]
        public void DeleteBook_ExistingIdPassed_RemovesOneBook()
        {
            // Act
            var okResponse = controller.DeleteBook(1);
            // Assert
            Assert.Equal(2, service.GetBooks().Result.Count);
        }

        [Fact]
        public void PutBook_UnknownIdPassed_ReturnsNotFoundResult()
        {
            // Arrange
            var testItem = new BookDTO()
            {
                Title = "test",
                Author = "test",
                Description = "test",
                PageCount = 100,
                LibraryId = 1
            };
            // Act
            var notFoundResult = controller.PutBook(4, testItem);
            // Assert
            Assert.IsType<NotFoundResult>(notFoundResult.Result);
        }

        [Fact]
        public void PutBook_ExistingIdPassed_ReturnsNoContentResult()
        {
            // Arrange
            var testItem = new BookDTO()
            {
                Title = "test",
                Author = "test",
                Description = "test",
                PageCount = 100,
                LibraryId = 1
            };
            // Act
            var notFoundResult = controller.PutBook(1, testItem);
            // Assert
            Assert.IsType<NoContentResult>(notFoundResult.Result);
        }

        [Fact]
        public void PutBook_ExistingIdPassed_UpdatesBook()
        {
            // Arrange
            var testItem = new BookDTO()
            {
                Title = "test",
                Author = "test",
                Description = "test",
                PageCount = 100,
                LibraryId = 1
            };
            // Act
            var notFoundResult = controller.PutBook(1, testItem);
            var updatedBook = service.GetBook(1).Result;
            var books = service.GetBooks().Result;
            // Assert
            Assert.Equal(3, books.Count);
            Assert.True(updatedBook != null);
            Assert.Equal("test", updatedBook.Title);
            Assert.Equal("test", updatedBook.Author);
            Assert.Equal("test", updatedBook.Description);
            Assert.Equal(100, updatedBook.PageCount);
        }

        private List<ValidationResult> ValidateModel<T>(T model)
        {
            var context = new ValidationContext(model, null, null);
            var result = new List<ValidationResult>();
            Validator.TryValidateObject(model, context, result, true);

            return result;
        }
    }
}
