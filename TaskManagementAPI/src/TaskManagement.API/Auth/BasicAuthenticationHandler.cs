using Azure.Core;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using TaskManagement.Infrastructure.Data;

namespace TaskManagement.API.Auth
{
    public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly AppDbContext _db;

        public BasicAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            AppDbContext db)
            : base(options, logger, encoder)
        {
            _db = db;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            // ✅ allow login endpoint
            if (Request.Path.StartsWithSegments("/api/auth/login"))
            {
                return AuthenticateResult.NoResult();
            }

            if (!Request.Headers.ContainsKey("Authorization"))
                return AuthenticateResult.Fail("Missing Header");

            var auth = Request.Headers.Authorization.ToString();

            if (string.IsNullOrWhiteSpace(auth) || !auth.StartsWith("Basic "))
            {
                return AuthenticateResult.Fail("Invalid Authorization Header");
            }

            var token = auth["Basic ".Length..].Trim();

            string decoded;

            try
            {
                decoded = Encoding.UTF8.GetString(Convert.FromBase64String(token));
            }
            catch
            {
                return AuthenticateResult.Fail("Invalid Base64 Token");
            }

            var credential = decoded.Split(':');

            if (credential.Length != 2)
            {
                return AuthenticateResult.Fail("Invalid Credential Format");
            }

            var username = credential[0];
            var password = credential[1];

            var user = await _db.Users.FirstOrDefaultAsync(x =>
                x.Username == username &&
                x.Password == password);

            if (user == null)
                return AuthenticateResult.Fail("Invalid Username or Password");

            var claims = new[]
            {
            new Claim(ClaimTypes.Name, username)
        };

            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return AuthenticateResult.Success(ticket);
        }
    }
}
