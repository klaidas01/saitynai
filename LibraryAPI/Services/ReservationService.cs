using LibraryAPI.DTO;
using LibraryAPI.Models;
using LibraryAPI.Repositories.Interfaces;
using LibraryAPI.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
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

        public async Task<List<Reservation>> GetReservations(string userName, string role)
        {
            if (role == "User")
            {
                var user = await _userManager.FindByNameAsync(userName);
                var userReservations = await _repo.GetUserReservations(user.UserName);
                return userReservations;
            }
            if (role == "Employee")
            {
                var user = await _userManager.FindByNameAsync(userName);
                var libraryReservations = await _repo.GetLibraryReservations(user.LibraryId);
                return libraryReservations;
            }
            var reservations = await _repo.GetAllReservations();
            return reservations;
        }

        public async Task<Reservation> GetReservation(int id, string userName, string role)
        {
            var reservation = await _repo.GetReservation(id);
            if (role == "User")
            {
                var user = await _userManager.FindByNameAsync(userName);
                if (reservation.UserId == user.UserName) return reservation;
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
            if (role == "Employee")
            {
                var user = await _userManager.FindByNameAsync(userName);
                var book = await _bookRepo.GetBook(reservation.BookId);
                if (book.LibraryId != user.LibraryId)
                    throw new UnauthorizedAccessException();
            }
            var id = await _repo.PostReservation(new Reservation { 
                BookId = reservation.BookId,
                StartDate = reservation.StartDate
            });
            return id;
        }

        public async Task<Reservation> DeleteReservation(int id, string userName, string role)
        {
            var reservation = await _repo.GetReservation(id);
            if (role == "Employee")
            {
                var user = await _userManager.FindByNameAsync(userName);
                var book = await _bookRepo.GetBook(reservation.BookId);
                if (book.LibraryId != user.LibraryId)
                    throw new UnauthorizedAccessException();
            }
            await _repo.DeleteReservation(reservation);
            return reservation;
        }

        public async Task<int> UpdateReservation(int id, ReservationDTO reservation, string userName, string role)
        {
            if (role == "Employee")
            {
                var user = await _userManager.FindByNameAsync(userName);
                var book = await _bookRepo.GetBook(reservation.BookId);
                if (book.LibraryId != user.LibraryId)
                    throw new UnauthorizedAccessException();
            }
            await _repo.UpdateReservation(new Reservation
            {
                BookId = reservation.BookId,
                StartDate = reservation.StartDate,
                ReturnDate = reservation.ReturnDate,
                IsReturned = reservation.IsReturned
            });
            return id;
        }
    }
}
