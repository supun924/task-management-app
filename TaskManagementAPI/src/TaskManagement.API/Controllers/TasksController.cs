using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using TaskManagement.Application.DTOs;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Entities;

namespace TaskManagement.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskRepository _repo;

    public TasksController(ITaskRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tasks = await _repo.GetAllAsync();

        var result = tasks.Select(x => new TaskResponseDto
        {
            Id = x.Id,
            Title = x.Title,
            Description = x.Description,
            IsCompleted = x.IsCompleted
        });

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTaskDto dto)
    {
        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            IsCompleted = false
        };

        await _repo.AddAsync(task);

        return Ok(dto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateTaskDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);

        if (existing == null)
            return NotFound();

        existing.Title = dto.Title;
        existing.Description = dto.Description;
        existing.IsCompleted = dto.IsCompleted;

        await _repo.UpdateAsync(existing);

        return Ok(dto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _repo.DeleteAsync(id);
        return Ok();
    }
}