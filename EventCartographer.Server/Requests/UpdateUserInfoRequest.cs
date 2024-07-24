﻿using System.ComponentModel.DataAnnotations;

namespace EventCartographer.Server.Requests
{
    public class UpdateUserInfoRequest
    {
        [Required(ErrorMessage = "A username is required.")]
        [MaxLength(100, ErrorMessage = "Too long username.")]
        [MinLength(3, ErrorMessage = "Too short username.")]
        public string? Username { get; set; }
    }
}
