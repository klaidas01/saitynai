using LibraryAPI.Constants;
using LibraryAPI.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryAPI.Context
{
    public class SeedDatabase
    {
        public static async Task SeedEssentialsAsync(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            //Seed Roles
            await roleManager.CreateAsync(new IdentityRole(Authorization.Roles.Administrator.ToString()));
            await roleManager.CreateAsync(new IdentityRole(Authorization.Roles.Employee.ToString()));
            await roleManager.CreateAsync(new IdentityRole(Authorization.Roles.User.ToString()));

            //Seed admin user
            var admin = new ApplicationUser { UserName = Authorization.admin_username, Email = Authorization.admin_email, EmailConfirmed = true, PhoneNumberConfirmed = true, FirstName = "AdminFirstName", LastName = "AdminLastName" };
            if (userManager.Users.All(u => u.Id != admin.Id))
            {
                await userManager.CreateAsync(admin, Environment.GetEnvironmentVariable("ADMIN_PWD"));
                await userManager.AddToRoleAsync(admin, Authorization.Roles.Administrator.ToString());
            }
        }
    }
}
