using LibraryAPI.DTO;
using LibraryAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryAPI.Repositories.Interfaces
{
    public interface IReservationRepository
    {
        public Task<List<Reservation>> GetAllReservations();
        public Task<ItemsDTO<ReservationResponse>> GetSlice(int page, int rowsPerPage, string searchTerm);
        public Task<SingleReservationResponse> GetReservation(int id);
        public Task<Reservation> GetUntrackedReservation(int id);
        public Task<List<Reservation>> GetUserReservations(string uid);
        public Task<List<Reservation>> GetLibraryReservations(int? libraryId);
        public Task<ItemsDTO<ReservationResponse>> GetLibrarySlice(int? libraryId, int page, int rowsPerPage, string searchTerm);
        public Task DeleteReservation(Reservation reservation);
        public Task UpdateReservation(Reservation reservation);
        public Task<int> PostReservation(Reservation reservation);
    }
}
