## linear (vectorised) versions of grid grobs
## for use with lapply and co (gpar exposed at top level)

text_grob <- function(label, 
                      parse = FALSE, 
                      col = "black",
                      fontsize = 12, 
                      cex = 1, 
                      fontfamily = "",
                      fontface = 1L,
                      lineheight = 1.2, 
                      alpha = 1, 
                      rot = 0,
                      check.overlap = FALSE,
                      name = NULL,
                      vp = NULL,
                      just = "centre",
                      hjust = 0.5,
                      vjust = 0.5, 
                      x = 0.5, 
                      y = 0.5,
                      default.units = "npc"){
  if(parse){
    label <- tryCatch(parse(text=label), 
                      error = function(e) label)
  }

  textGrob(label = label, x = x, y = y, 
           just = just, hjust = hjust, vjust = vjust, 
           rot = rot, check.overlap = check.overlap, 
           default.units = default.units,
           name = name, vp = vp,
           gp = gpar(col = col, 
                     cex = cex, 
                     fontfamily = fontfamily,
                     fontface = fontface,
                     fontsize = fontsize, 
                     lineheight = lineheight, 
                     alpha = alpha))
  
}


rect_grob <- function(fill = "white", 
                      col = "black", 
                      lty = "solid", 
                      lwd = 1, cex = 1, 
                      alpha = 1, 
                      lineend = "round", 
                      linejoin = "round", 
                      linemitre = 10, 
                      lex = 1,
                      name = NULL,
                      vp = NULL,
                      just = "centre",
                      hjust = 0.5,
                      vjust = 0.5, 
                      width = unit(1,"npc") - unit(2, "scaledpts"), 
                      height = unit(1,"npc") - unit(2, "scaledpts"), 
                      x = 0.5, 
                      y = 0.5,
                      default.units = "npc"){
  
  rectGrob(x = x,
           y = y,
           just = just, hjust = hjust, vjust = vjust, 
           width = width, 
           height = height,
           default.units = default.units,
           name = name, vp = vp,
           gp = gpar(col = col, 
                     fill = fill,
                     alpha = alpha, 
                     lty = lty, 
                     lwd = lwd, 
                     lex = lex,  
                     lineend = lineend, 
                     linejoin = linejoin, 
                     linemitre = linemitre, 
                     cex = cex))
}

