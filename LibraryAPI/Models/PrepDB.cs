using LibraryAPI.Context;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryAPI.Models
{
    public static class PrepDB
    {
        public static void prep(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                serviceScope.ServiceProvider.GetService<LibraryContext>().Database.Migrate();
            }
        }
    }
}
