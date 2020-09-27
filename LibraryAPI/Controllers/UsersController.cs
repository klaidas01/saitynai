using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LibraryAPI.DTO;
using LibraryAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDTO model)
        {
            var result = await _userService.Register(model);
            return Ok(result);
        }

        [HttpPost("token")]
        public async Task<IActionResult> GetToken(TokenDTO model)
        {
            var result = await _userService.GetTokenAsync(model);
            return Ok(result);
        }

        [HttpPut("admin")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> PromoteToAdmin(AdminRoleDTO model)
        {
            var result = await _userService.PromoteToAdmin(model.UserName);
            return Ok(result);
        }

        [HttpPut("employee")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> PromoteToEmployee(EmployeeRoleDTO model)
        {
            var result = await _userService.PromoteToEmployee(model);
            return Ok(result);
        }
    }
}
