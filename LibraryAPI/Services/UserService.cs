using LibraryAPI.Constants;
using LibraryAPI.DTO;
using LibraryAPI.Models;
using LibraryAPI.Repositories.Interfaces;
using LibraryAPI.Services.Interfaces;
using LibraryAPI.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Server.IIS;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace LibraryAPI.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly JWT _jwt;
        private readonly ILibraryRepository _libraryRepo;
        public UserService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IOptions<JWT> jwt, ILibraryRepository libraryRepo)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _jwt = jwt.Value;
            _libraryRepo = libraryRepo;
        }

        public async Task<List<UserDTO>> getUsers()
        {
            var users = await _userManager
                .Users
                .Select(u => new UserDTO { UserName = u.UserName, FirstName = u.FirstName, LastName = u.LastName, Email = u.Email, Id = u.Id})
                .ToListAsync();
            return users;
        }

        public async Task<List<UserDTO>> getUser(string id)
        {
            var user = await _userManager
                .Users
                .Where(u => u.Id == id)
                .Select(u => new UserDTO { UserName = u.UserName, FirstName = u.FirstName, LastName = u.LastName, Email = u.Email, Id = u.Id })
                .ToListAsync();
            return user;
        }

        public async Task<string> Register(RegisterDTO model)
        {
            var user = new ApplicationUser
            {
                UserName = model.Username,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName
            };
            var userWithSameEmail = await _userManager.FindByEmailAsync(model.Email);
            var userWithSameName = await _userManager.FindByNameAsync(model.Username);
            if (userWithSameEmail == null && userWithSameName == null)
            {
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, Authorization.default_role.ToString());
                    return user.Id;
                }
                return "Failure";
            }
            else
            {
                return "Conflict";
            }
        }

        public async Task<TokenResponse> GetTokenAsync(TokenDTO model)
        {
            var authenticationModel = new TokenResponse();
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null)
            {
                authenticationModel.Message = $"No Accounts Registered with {model.UserName}.";
                return authenticationModel;
            }
            if (await _userManager.CheckPasswordAsync(user, model.Password))
            {
                authenticationModel.Token = await CreateJwtToken(user);
                authenticationModel.Email = user.Email;
                authenticationModel.UserName = user.UserName;
                var rolesList = await _userManager.GetRolesAsync(user).ConfigureAwait(false);
                authenticationModel.Roles = rolesList.ToList();

                var refreshToken = GenerateRefreshToken();
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpirationDate = DateTime.Now.AddDays(7);
                authenticationModel.RefreshToken = refreshToken;
                await _userManager.UpdateAsync(user);
                return authenticationModel;
            }
            authenticationModel.Message = $"Incorrect Credentials.";
            return authenticationModel;
        }

        public async Task<TokenResponse> RefreshToken(RefreshTokenDTO model)
        {
            var principal = GetPrincipalFromExpiredToken(model.AccessToken);

            var username = principal.Identity.Name;

            var user = await _userManager.FindByNameAsync(username);

            if (user == null || user.RefreshToken != model.RefreshToken || user.RefreshTokenExpirationDate <= DateTime.Now)
                return null;

            var token = await CreateJwtToken(user);
            var newRefreshToken = GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpirationDate = DateTime.Now.AddDays(7);
            await _userManager.UpdateAsync(user);
            var rolesList = await _userManager.GetRolesAsync(user).ConfigureAwait(false);

            return new TokenResponse { Email = user.Email, Roles = rolesList.ToList(), UserName = user.UserName, Token = token, RefreshToken = newRefreshToken};
        }

        private async Task<string> CreateJwtToken(ApplicationUser user)
        {
            var userClaims = await _userManager.GetClaimsAsync(user);
            var roles = await _userManager.GetRolesAsync(user);
            var roleClaims = new List<Claim>();
            for (int i = 0; i < roles.Count; i++)
            {
                roleClaims.Add(new Claim("roles", roles[i]));
            }
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("uid", user.Id)
            }
            .Union(userClaims)
            .Union(roleClaims);
            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);
            var jwtSecurityToken = new JwtSecurityToken(
                issuer: _jwt.Issuer,
                audience: _jwt.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwt.DurationInMinutes),
                signingCredentials: signingCredentials);
            var tokenString = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
            return tokenString;
        }

        public async Task<string> PromoteToAdmin(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return $"No Accounts Registered with {username}.";
            }
            user.LibraryId = null;
            var oldRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, oldRoles);
            await _userManager.AddToRoleAsync(user, Authorization.Roles.Administrator.ToString());
            await _userManager.UpdateAsync(user);
            return $"user {username} role changed to administrator.";
        }

        public async Task<string> PromoteToEmployee(EmployeeRoleDTO model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null)
            {
                return $"No Accounts Registered with {model.UserName}.";
            }
            var library = await _libraryRepo.GetLibrary(model.LibraryId);
            if (library == null)
            {
                return "Library not found";
            }
            user.LibraryId = model.LibraryId;
            var oldRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, oldRoles);
            await _userManager.AddToRoleAsync(user, Authorization.Roles.Employee.ToString());
            await _userManager.UpdateAsync(user);
            return $"user {model.UserName} role changed to Employee.";
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key)),
                ValidateLifetime = false 
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");
            return principal;
        }
    }
}
