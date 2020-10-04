using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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

        [HttpGet]
        [Authorize(Roles = "Administrator,Employee")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            var books = await _userService.getUsers();
            return Ok(books);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrator,Employee")]
        public async Task<ActionResult<UserDTO>> GetUser(string id)
        {
            var user = await _userService.getUser(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDTO model)
        {
            var result = await _userService.Register(model);
            if (result == "Conflict")
                return Conflict("Username or email already in use");
            if (result == "Failure")
                return StatusCode(500);
            var user = await _userService.getUser(result);
            return CreatedAtAction("GetUser", new { id = result }, user);
        }

        [HttpPost("token")]
        public async Task<IActionResult> GetToken(TokenDTO model)
        {
            var result = await _userService.GetTokenAsync(model);
            return Ok(result);
        }

        [HttpPatch("admin")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> PromoteToAdmin(AdminRoleDTO model)
        {
            var result = await _userService.PromoteToAdmin(model.UserName);
            return Ok(result);
        }

        [HttpPatch("employee")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> PromoteToEmployee(EmployeeRoleDTO model)
        {
            var result = await _userService.PromoteToEmployee(model);
            return Ok(result);
        }
    }
}
