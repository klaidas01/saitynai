using LibraryAPI.DTO;
using LibraryAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryAPI.Services.Interfaces
{
    public interface IReservationService
    {
        public Task<List<Reservation>> GetReservations(string userName, string role);
        public Task<Reservation> GetReservation(int id, string userName, string role);
        public Task<int> PostReservation(ReservationDTO reservation, string userName, string role);
        public Task<Reservation> DeleteReservation(int id, string userName, string role);
        public Task<int> UpdateReservation(int id, ReservationDTO reservation, string userName, string role);
    }
}
