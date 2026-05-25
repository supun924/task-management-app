using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using TaskManagement.Application.DTOs;
using TaskManagement.Infrastructure.Data;

namespace TaskManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;

    public AuthController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(x =>
            x.Username == request.Username &&
            x.Password == request.Password);

        if (user == null)
        {
            return Unauthorized(new
            {
                message = "Invalid username or password"
            });
        }

        return Ok(new
        {
            message = "Login successful",
            user = new
            {
                user.Id,
                user.Username
            }
        });
    }
}