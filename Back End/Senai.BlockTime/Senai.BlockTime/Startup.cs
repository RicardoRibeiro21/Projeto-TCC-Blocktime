using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infra.Data.Interfaces;
using Infra.Data.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Services.Interfaces;
using Services.Services;
using Swashbuckle.AspNetCore.Swagger;

namespace Senai.BlockTime
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
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);


            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Senai_BlockTime", Version = "v1" });
            });

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = "JwtBearer";
                options.DefaultChallengeScheme = "JwtBearer";
            }
           ).AddJwtBearer("JwtBearer", options =>
           {
               //Define as opções 
               options.TokenValidationParameters = new TokenValidationParameters
               {
                   //Quem esta solicitando
                   ValidateIssuer = true,
                   //Quem esta validadando
                   ValidateAudience = true,
                   //Definindo o tempo de expiração
                   ValidateLifetime = true,
                   //Forma de criptografia
                   IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("Senai-BlockTime-chave-autenticacao")),
                   //Tempo de expiração do Token
                   ClockSkew = TimeSpan.FromMinutes(30),
                   //Nome da Issuer, de onde esta vindo
                   ValidIssuer = "SenaiBlockTime.WebApi",
                   //Nome da Audience, de onde esta vindo
                   ValidAudience = "SenaiBlockTime.WebApi"
               };
           });

            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<IEventService, EventService>();
            services.AddTransient<IGroupService, GroupService>();
            services.AddTransient<IHostsService, HostsService>();
            services.AddTransient<ITriggerService, TriggerService>();
            services.AddTransient<IPDFService, PDFService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), 
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Senai_BlockTime");
            });

            app.UseAuthentication();

            app.UseCors("CorsPolicy");



            app.UseMvc();
        }
    }
}
