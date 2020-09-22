using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LibraryAPI.Context;
using LibraryAPI.Models;
using LibraryAPI.Repositories;
using LibraryAPI.Repositories.Interfaces;
using LibraryAPI.Services;
using LibraryAPI.Services.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.Web.CodeGeneration.EntityFrameworkCore;
using Npgsql;

namespace LibraryAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            string connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
            if (connectionString != null)
            {
                var databaseUri = new Uri(connectionString);
                var userInfo = databaseUri.UserInfo.Split(':');

                var builder = new NpgsqlConnectionStringBuilder
                {
                    Host = databaseUri.Host,
                    Port = databaseUri.Port,
                    Username = userInfo[0],
                    Password = userInfo[1],
                    Database = databaseUri.LocalPath.TrimStart('/')
                };

                connectionString = builder.ToString();
            }
            else connectionString = Configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<LibraryContext>(options =>
                options.UseNpgsql(connectionString));

            services.AddScoped<ILibraryService, LibraryService>();
            services.AddScoped<ILibraryRepository, LibraryRepository>();

            services.AddScoped<IBookService, BookService>();
            services.AddScoped<IBookRepository, BookRepository>();

            services.AddScoped<IReservationService, ReservationService>();
            services.AddScoped<IReservationRepository, ReservationRepository>();

            services.AddControllers().AddNewtonsoftJson(options =>
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            );

            services.AddSwaggerGen();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Library API");
                c.RoutePrefix = string.Empty;
            });

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            PrepDB.prep(app);
        }
    }
}
