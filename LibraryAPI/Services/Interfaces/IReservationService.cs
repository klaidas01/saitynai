using LibraryAPI.DTO;
using LibraryAPI.Models;
using System.Threading.Tasks;

namespace LibraryAPI.Services.Interfaces
{
    public interface IReservationService
    {
        public Task<ItemsDTO<ReservationResponse>> GetReservations(string userName, string role, int page, int rowsPerPage, string searchTerm = "");
        public Task<ItemsDTO<ReservationResponse>> GetUserReservations(string userName, string role, int page, int rowsPerPage, string searchTerm = "");
        public Task<Reservation> GetReservation(int id, string userName, string role);
        public Task<int> PostReservation(ReservationDTO reservation, string userName, string role);
        public Task<Reservation> DeleteReservation(int id, string userName, string role);
        public Task<int> UpdateReservation(int id, ReservationDTO reservation, string userName, string role);
        public Task<int> ReturnBook(int id, string userName, string role);
    }
}
