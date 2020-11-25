using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryAPI.Models;
using LibraryAPI.Services.Interfaces;
using LibraryAPI.DTO;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationService _reservationService;

        public ReservationsController(IReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        // GET: api/Reservations
        [HttpGet]
        [Authorize(Roles = "Administrator,Employee")]
        public async Task<ActionResult<ItemsDTO<Reservation>>> GetReservations([FromQuery] SliceDTO slice)
        {
            var role = this.User.FindFirst(ClaimTypes.Role).Value;
            var userName = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var reservations = await _reservationService.GetReservations(userName, role, slice.Page, slice.RowsPerPage, (slice.SearchTerm != null) ? slice.SearchTerm : "");
            return Ok(reservations);
        }

        // GET: api/Reservation/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Reservation>> GetReservation(int id)
        {
            var role = this.User.FindFirst(ClaimTypes.Role).Value;
            var userName = User.FindFirstValue(ClaimTypes.NameIdentifier);
            try
            {
                var reservation = await _reservationService.GetReservation(id, userName, role);

                if (reservation == null)
                {
                    return NotFound();
                }

                return Ok(reservation);
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403);
            }
        }

        // PUT: api/Reservations/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator,Employee")]
        public async Task<IActionResult> PutReservation(int id, ReservationDTO reservation)
        {
            var role = this.User.FindFirst(ClaimTypes.Role).Value;
            var userName = User.FindFirstValue(ClaimTypes.NameIdentifier);
            try
            {
                await _reservationService.UpdateReservation(id, reservation, userName, role);
                return NoContent();
            }
            catch (DbUpdateException)
            {
                return BadRequest();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403);
            }
        }

        // POST: api/Reservations
        [HttpPost]
        [Authorize(Roles = "Administrator,Employee")]
        public async Task<ActionResult<Reservation>> PostReservation(ReservationDTO reservation)
        {
            var role = this.User.FindFirst(ClaimTypes.Role).Value;
            var userName = User.FindFirstValue(ClaimTypes.NameIdentifier);
            try
            {
                var reservationId = await _reservationService.PostReservation(reservation, userName, role);

                return CreatedAtAction("GetReservation", new { id = reservationId }, reservation);
            }
            catch (DbUpdateException)
            {
                return BadRequest();
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403);
            }
        }

        // DELETE: api/Reservations/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator,Employee")]
        public async Task<ActionResult<Reservation>> DeleteReservation(int id)
        {
            var role = this.User.FindFirst(ClaimTypes.Role).Value;
            var userName = User.FindFirstValue(ClaimTypes.NameIdentifier);
            try
            {
                var reservation = await _reservationService.DeleteReservation(id, userName, role);
                return Ok(reservation);
            }
            catch (ArgumentNullException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403);
            }
        }
    }
}
