using LibraryAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryAPI.Repositories.Interfaces
{
    public interface IReservationRepository
    {
        public Task<List<Reservation>> GetAllReservations();
        public Task<Reservation> GetReservation(int id);
        public Task DeleteReservation(Reservation reservation);
        public Task UpdateReservation(Reservation reservation);
        public Task<int> PostReservation(Reservation reservation);
    }
}
