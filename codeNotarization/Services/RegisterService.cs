using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using codeNotarization.Models;

namespace codeNotarization.Services
{
    public class RegisterService
    {
        public RegisterModel Authenticate(RegisterModel conta)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(Settings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim("Address", conta.Address),
                    new Claim("Nome", conta.Name),
                    new Claim("Email", conta.Email),
                    new Claim("Telemovel", conta.Telemovel),
                    new Claim("Pais", conta.Pais),
                    new Claim("Cidade", conta.Cidade)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            conta.Token = tokenHandler.WriteToken(token);

            return conta;
        }
    }
}


