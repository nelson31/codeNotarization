using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace codeNotarization
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Usado para o utilizador inserir a password do MySQL
            Console.WriteLine("Introduza a password do MySQL: ");
            string password = Console.ReadLine();
            Settings.passMySQL = password;

            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
