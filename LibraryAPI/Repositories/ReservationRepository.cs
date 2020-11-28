using LibraryAPI.Context;
using LibraryAPI.DTO;
using LibraryAPI.Models;
using LibraryAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryAPI.Repositories
{
    public class ReservationRepository : IReservationRepository
    {
        private readonly LibraryContext _context;

        public ReservationRepository(LibraryContext context)
        {
            _context = context;
        }

        public async Task<List<Reservation>> GetAllReservations()
        {
            var reservations = await _context.Reservations
                .Include(r => r.Book)
                .ToListAsync();

            return reservations;
        }

        public async Task<ItemsDTO<ReservationResponse>> GetSlice(int page, int rowsPerPage, string searchTerm)
        {
            var count = _context.Reservations.Count(r => r.User.UserName.ToLower().Contains(searchTerm.ToLower()));
            var reservations = await _context.Reservations
                .OrderBy(r => r.IsReturned)
                .ThenBy(r => r.ReturnDate)
                .Where(r => r.User.UserName.ToLower().Contains(searchTerm.ToLower()))
                .Skip((page) * rowsPerPage)
                .Take(rowsPerPage)
                .Select(r => (!r.IsReturned && r.ReturnDate < DateTime.Now) 
                    ? new ReservationResponse { Id = r.Id, StartDate = r.StartDate, ReturnDate = r.ReturnDate, State = "Late", LateFee = Math.Ceiling((DateTime.Now - r.ReturnDate).TotalDays) * r.Book.LateFee, LibraryId = r.Book.LibraryId, LibraryName = r.Book.Library.Name, BookName = r.Book.Title, UserName = r.User.UserName, IsReturned = r.IsReturned } 
                    : new ReservationResponse { Id = r.Id, StartDate = r.StartDate, ReturnDate = r.ReturnDate, State = r.IsReturned ? "Returned" : "Ongoing", LateFee = null, LibraryId = r.Book.LibraryId, LibraryName = r.Book.Library.Name, BookName = r.Book.Title, UserName = r.User.UserName, IsReturned = r.IsReturned })
                .ToListAsync();

            return new ItemsDTO<ReservationResponse> { items = reservations, count = count };
        }

        public async Task<ItemsDTO<ReservationResponse>> GetUserReservations(string uid, int page, int rowsPerPage, string searchTerm)
        {
            var count = _context.Reservations.Count(r => r.Book.Title.ToLower().Contains(searchTerm.ToLower()));
            var reservations = await _context.Reservations
                .OrderBy(r => r.IsReturned)
                .ThenBy(r => r.ReturnDate)
                .Where(r => r.Book.Title.ToLower().Contains(searchTerm.ToLower()))
                .Where(r => r.UserId == uid)
                .Skip((page) * rowsPerPage)
                .Take(rowsPerPage)
                .Select(r => (!r.IsReturned && r.ReturnDate < DateTime.Now)
                    ? new ReservationResponse { Id = r.Id, StartDate = r.StartDate, ReturnDate = r.ReturnDate, State = "Late", LateFee = Math.Ceiling((DateTime.Now - r.ReturnDate).TotalDays) * r.Book.LateFee, LibraryId = r.Book.LibraryId, LibraryName = r.Book.Library.Name, BookName = r.Book.Title, UserName = r.User.UserName, IsReturned = r.IsReturned }
                    : new ReservationResponse { Id = r.Id, StartDate = r.StartDate, ReturnDate = r.ReturnDate, State = r.IsReturned ? "Returned" : "Ongoing", LateFee = null, LibraryId = r.Book.LibraryId, LibraryName = r.Book.Library.Name, BookName = r.Book.Title, UserName = r.User.UserName, IsReturned = r.IsReturned })
                .ToListAsync();

            return new ItemsDTO<ReservationResponse> { items = reservations, count = count };
        }

        public async Task<List<Reservation>> GetLibraryReservations(int? libraryId)
        {
            var reservations = await _context.Reservations
                .Include(r => r.Book)
                .Where(r => r.Book.LibraryId == libraryId)
                .ToListAsync();

            return reservations;
        }

        public async Task<ItemsDTO<ReservationResponse>> GetLibrarySlice(int? libraryId, int page, int rowsPerPage, string searchTerm)
        {
            var count = _context.Reservations.Count(r => r.User.UserName.ToLower().Contains(searchTerm.ToLower()) && r.Book.LibraryId == libraryId);
            var reservations = await _context.Reservations
                .OrderBy(r => r.IsReturned)
                .ThenBy(r => r.ReturnDate)
                .Where(r => r.User.UserName.ToLower().Contains(searchTerm.ToLower()) && r.Book.LibraryId == libraryId)
                .Skip((page) * rowsPerPage)
                .Take(rowsPerPage)
                .Select(r => (!r.IsReturned && r.ReturnDate < DateTime.Now)
                    ? new ReservationResponse { Id = r.Id, StartDate = r.StartDate, ReturnDate = r.ReturnDate, State = "Late", LateFee = Math.Ceiling((DateTime.Now - r.ReturnDate).TotalDays) * r.Book.LateFee, LibraryId = r.Book.LibraryId, LibraryName = r.Book.Library.Name, BookName = r.Book.Title, UserName = r.User.UserName, IsReturned = r.IsReturned }
                    : new ReservationResponse { Id = r.Id, StartDate = r.StartDate, ReturnDate = r.ReturnDate, State = r.IsReturned ? "Returned" : "Ongoing", LateFee = null, LibraryId = r.Book.LibraryId, LibraryName = r.Book.Library.Name, BookName = r.Book.Title, UserName = r.User.UserName, IsReturned = r.IsReturned })
                .ToListAsync();

            return new ItemsDTO<ReservationResponse> { items = reservations, count = count };
        }

        public async Task<Reservation> GetReservation(int id)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Book)
                .Where(r => r.Id == id)
                .FirstOrDefaultAsync();

            return reservation;
        }

        public async Task<Reservation> GetUntrackedReservation(int id)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Book)
                .Where(r => r.Id == id)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            return reservation;
        }

        public async Task DeleteReservation(Reservation reservation)
        {
            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateReservation(Reservation reservation)
        {
            _context.Entry(reservation).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task<int> PostReservation(Reservation reservation)
        {
            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();
            return reservation.Id;
        }
    }
}
