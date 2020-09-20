using LibraryAPI.DTO;
using LibraryAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryAPI.Services.Interfaces
{
    public interface IReservationService
    {
        public Task<List<Reservation>> GetReservations();
        public Task<Reservation> GetReservation(int id);
        public Task<int> PostReservation(ReservationDTO reservation);
        public Task<Reservation> DeleteReservation(int id);
        public Task<int> UpdateReservation(int id, ReservationDTO reservation);
    }
}
