using LibraryAPI.Context;
using LibraryAPI.Models;
using LibraryAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
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

        public async Task<Reservation> GetReservation(int id)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Book)
                .Where(r => r.Id == id)
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
