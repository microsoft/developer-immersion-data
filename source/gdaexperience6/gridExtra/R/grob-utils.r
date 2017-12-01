latticeGrob <- function(p, ...){
  grob(p=p, ..., cl="lattice")
}



#' @importFrom graphics plot
#' @export
drawDetails.lattice <- function(x, recording=FALSE){
  stopifnot(requireNamespace("lattice", quietly = TRUE)) 
  plot(x$p, newpage=FALSE)
}


row_heights <- function(m){
  do.call(unit.c, apply(m, 1, function(l)
    max(do.call(unit.c, lapply(l, grobHeight)))))
}

col_widths <- function(m){
  do.call(unit.c, apply(m, 2, function(l)
    max(do.call(unit.c, lapply(l, grobWidth)))))
}

