using LibraryAPI.DTO;
using LibraryAPI.Models;
using LibraryAPI.Repositories.Interfaces;
using LibraryAPI.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryAPI.Services
{
    public class ReservationService : IReservationService
    {
        private readonly IReservationRepository _repo;

        public ReservationService(IReservationRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<Reservation>> GetReservations()
        {
            var reservations = await _repo.GetAllReservations();
            return reservations;
        }

        public async Task<Reservation> GetReservation(int id)
        {
            var reservation = await _repo.GetReservation(id);
            return reservation;
        }

        public async Task<int> PostReservation(ReservationDTO reservation)
        {
            var id = await _repo.PostReservation(new Reservation { 
                BookId = reservation.BookId,
                StartDate = reservation.StartDate
            });
            return id;
        }

        public async Task<Reservation> DeleteReservation(int id)
        {
            var reservation = await _repo.GetReservation(id);
            await _repo.DeleteReservation(reservation);
            return reservation;
        }

        public async Task<int> UpdateReservation(int id, ReservationDTO reservation)
        {
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
