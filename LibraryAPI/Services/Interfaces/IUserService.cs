﻿using LibraryAPI.DTO;
using LibraryAPI.Models;
using System.Threading.Tasks;

namespace LibraryAPI.Services.Interfaces
{
    public interface IUserService
    {
        Task<ItemsDTO<UserDTO>> getUsers(int page, int rowsPerPage, string searchTerm);
        Task<UserDTO> getUser(string id);
        Task<string> Register(RegisterDTO model);
        Task<TokenResponse> GetTokenAsync(TokenDTO model);
        Task<TokenResponse> RefreshToken(RefreshTokenDTO model);
        Task<string> PromoteToAdmin(string username);
        Task<string> PromoteToEmployee(EmployeeRoleDTO model);
    }
}
