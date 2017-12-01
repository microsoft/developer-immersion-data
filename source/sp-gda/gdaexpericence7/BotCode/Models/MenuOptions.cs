using System;
using System.Collections.Generic;

namespace SimpleEchoBot.Models
{
    [Serializable]
    public class MenuOptions
    {
        public MenuOptions()
        {
            Options = new List<Options>();
        }
      
        public List<Options> Options { get; set; }
        
    }
}