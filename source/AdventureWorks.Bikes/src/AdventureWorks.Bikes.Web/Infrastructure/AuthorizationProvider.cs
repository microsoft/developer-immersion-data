using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using AdventureWorks.Bikes.Infrastructure.Sql.Model;
using AspNet.Security.OpenIdConnect.Server;
using Microsoft.Extensions.Options;
using AspNet.Security.OpenIdConnect.Extensions;
using Microsoft.Extensions.Configuration;

namespace AdventureWorks.Bikes.Web.Infrastructure
{
    public sealed class AuthorizationProvider : OpenIdConnectServerProvider
    {
        private readonly string _ClientId = string.Empty;
        private readonly string _ClientSecret = string.Empty;
        private readonly string _Audience = string.Empty;
        public static readonly string ClaimStore = "StoreId";

        public AuthorizationProvider(IConfigurationRoot configuration)
        {
            _ClientId = configuration["Security:ClientId"];
            _ClientSecret = configuration["Security:ClientSecret"];
            _Audience = configuration["Security:Audience"];
        }

        public override Task ValidateTokenRequest(ValidateTokenRequestContext context)
        {
            // Only allow resource owner credential flow
            if (!context.Request.IsPasswordGrantType())
            {
                context.Reject(
                    error: "unsupported_grant_type",
                    description: "Only resource owner credentials " +
                                 "are accepted by this authorization server");
            }

            context.Validate();

            return Task.FromResult<object>(null);
        }

        public override async Task HandleTokenRequest(HandleTokenRequestContext context)
        {
            // Don't inject the UserManager to avoid save a reference for the application lifetime
            // Internally manages an EF DbContext
            var userManager = context.HttpContext.RequestServices.GetRequiredService<UserManager<ApplicationUser>>();

            bool isValidUser = false;
            var user = await userManager.FindByNameAsync(context.Request.Username);
            if (user != null)
                isValidUser = await userManager.CheckPasswordAsync(user, context.Request.Password);

            if (isValidUser)
            {
                var identity = new ClaimsIdentity(context.Options.AuthenticationScheme);

                identity.AddClaim(ClaimTypes.NameIdentifier, user.UserName);
                identity.AddClaim(ClaimTypes.GivenName, user.FullName);

                identity.AddClaim("username", user.UserName,
                        OpenIdConnectConstants.Destinations.AccessToken,
                        OpenIdConnectConstants.Destinations.IdentityToken);

                var ticket = new AuthenticationTicket(
                        new ClaimsPrincipal(identity),
                        new AuthenticationProperties(),
                        context.Options.AuthenticationScheme);

                ticket.SetScopes("api");

                context.Validate(ticket);
            }
            else
            {
                context.Reject();
            }
        }

        public override Task SerializeAccessToken(SerializeAccessTokenContext context)
        {
            context.Audiences = new List<string>() { _Audience };

            return Task.FromResult<object>(null);
        }
    }
}
