using LibraryAPI.DTO;
using LibraryAPI.Models;
using LibraryAPI.Repositories.Interfaces;
using LibraryAPI.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryAPI.Services
{
    public class ReservationService : IReservationService
    {
        private readonly IReservationRepository _repo;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IBookRepository _bookRepo;

        public ReservationService(IReservationRepository repo, UserManager<ApplicationUser> userManager, IBookRepository bookRepo)
        {
            _repo = repo;
            _userManager = userManager;
            _bookRepo = bookRepo;
        }

        public async Task<ItemsDTO<ReservationResponse>> GetReservations(string userName, string role, int page, int rowsPerPage, string searchTerm = "")
        {
            if (role == "Employee")
            {
                var user = await _userManager.FindByNameAsync(userName);
                var libraryReservations = await _repo.GetLibrarySlice(user.LibraryId, page, rowsPerPage, searchTerm);
                return libraryReservations;
            }
            var reservations = await _repo.GetSlice(page, rowsPerPage, searchTerm);
            return reservations;
        }

        public async Task<ItemsDTO<ReservationResponse>> GetUserReservations(string userName, string role, int page, int rowsPerPage, string searchTerm = "")
        {
            var user = await _userManager.FindByNameAsync(userName);
            var reservations = await _repo.GetUserReservations(user.Id, page, rowsPerPage, searchTerm);
            return reservations;
        }

        public async Task<Reservation> GetReservation(int id, string userName, string role)
        {
            var reservation = await _repo.GetReservation(id);
            if (reservation == null) return reservation;
            if (role == "User")
            {
                var user = await _userManager.FindByNameAsync(userName);
                if (reservation.UserId == user.Id) return reservation;
                else throw new UnauthorizedAccessException();
            }
            if (role == "Employee")
            {
                var user = await _userManager.FindByNameAsync(userName);
                if (reservation.Book.LibraryId == user.LibraryId) return reservation;
                else throw new UnauthorizedAccessException();
            }
            return reservation;
        }

        public async Task<int> PostReservation(ReservationDTO reservation, string userName, string role)
        {
            var book = await _bookRepo.GetBook((int)reservation.BookId);
            if (book.IsReserved) throw new DbUpdateException();
            if (role == "Employee")
            {
                var user = await _userManager.FindByNameAsync(userName);
                if (user == null || book == null) throw new DbUpdateException();
                if (book.LibraryId != user.LibraryId)
                    throw new UnauthorizedAccessException();
            }
            var id = await _repo.PostReservation(new Reservation { 
                BookId = (int)reservation.BookId,
                UserId = reservation.UserId,
                StartDate = (DateTime)reservation.StartDate,
                ReturnDate = (DateTime)reservation.ReturnDate,
                IsReturned = false
            });
            book.IsReserved = true;
            await _bookRepo.UpdateBook(book);
            return id;
        }

        public async Task<Reservation> DeleteReservation(int id, string userName, string role)
        {
            var reservation = await _repo.GetReservation(id);
            var book = await _bookRepo.GetBook(reservation.BookId);
            if (role == "Employee")
            {
                var user = await _userManager.FindByNameAsync(userName);
                if (book.LibraryId != user.LibraryId)
                    throw new UnauthorizedAccessException();
            }
            await _repo.DeleteReservation(reservation);
            if (!reservation.IsReturned)
            {
                book.IsReserved = false;
                await _bookRepo.UpdateBook(book);
            }
            return reservation;
        }

        public async Task<int> UpdateReservation(int id, ReservationDTO reservation, string userName, string role)
        {
            if (reservation.IsReturned) throw new KeyNotFoundException();
            var oldReservation = await _repo.GetUntrackedReservation(id);
            if (oldReservation == null || oldReservation.IsReturned) throw new KeyNotFoundException();
            var book = await _bookRepo.GetBook((int)reservation.BookId);
            var oldBook = await _bookRepo.GetBook((int)oldReservation.BookId);
            if (book.IsReserved && book.Id != oldBook.Id) throw new KeyNotFoundException();
            if (role == "Employee")
            {
                var user = await _userManager.FindByNameAsync(userName);
                if (book.LibraryId != user.LibraryId || book.LibraryId != oldBook.LibraryId)
                    throw new UnauthorizedAccessException();
            }
            await _repo.UpdateReservation(new Reservation
            {
                Id = id,
                BookId = (int)reservation.BookId,
                UserId = reservation.UserId,
                StartDate = (DateTime)reservation.StartDate,
                ReturnDate = (DateTime)reservation.ReturnDate,
                IsReturned = false
            });
            if (book.Id != oldBook.Id)
            {
                oldBook.IsReserved = false;
                book.IsReserved = true;
                await _bookRepo.UpdateBook(oldBook);
                await _bookRepo.UpdateBook(book);
            }
            return id;
        }

        public async Task<int> ReturnBook(int id, string userName, string role)
        {
            var oldReservation = await _repo.GetReservation(id);
            if (oldReservation == null || oldReservation.IsReturned) throw new KeyNotFoundException();
            var oldBook = await _bookRepo.GetBook((int)oldReservation.BookId);
            if (!oldBook.IsReserved) throw new KeyNotFoundException();
            if (role == "Employee")
            {
                var user = await _userManager.FindByNameAsync(userName);
                if (oldBook.LibraryId != user.LibraryId)
                    throw new UnauthorizedAccessException();
            }
            oldReservation.IsReturned = true;
            oldBook.IsReserved = false;
            await _repo.UpdateReservation(oldReservation);
            await _bookRepo.UpdateBook(oldBook);
            return id;
        }
    }
}
