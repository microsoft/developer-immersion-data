##' @aliases ngonGrob grid.ngon ellipseGrob grid.ellipse
##' @title Regular polygon grob
##' @description Regular polygons with optional rotation, stretching, and aesthetic attributes.
##' @describeIn ngonGrob return a polygon grob  
##' @param x x unit
##' @param y y unit
##' @param n number of vertices
##' @param size radius of circumscribing circle
##' @param phase angle in radians of first point relative to x axis
##' @param ar aspect ratio
##' @param angle angle of polygon in radians
##' @param position.units default units for the positions
##' @param size.units grid units for the sizes
##' @param gp gpar
##' @param ... further parameters passed to polygonGrob
##' @return A grob.
##' @export
##' @examples
##' library(grid)
##' N <- 5
##' xy <- polygon_regular(N)*2
##' 
##' # draw multiple polygons
##' g <- ngonGrob(unit(xy[,1],"cm") + unit(0.5,"npc"), 
##'               unit(xy[,2],"cm") + unit(0.5,"npc"),
##'               n = seq_len(N) + 2, gp = gpar(fill=1:N))
##' 
##' grid.newpage()
##' grid.draw(g)
##' 
##' # rotated and stretched
##' g2 <- ngonGrob(unit(xy[,1],"cm") + unit(0.5,"npc"), 
##'               unit(xy[,2],"cm") + unit(0.5,"npc"),
##'               n = seq_len(N) + 2, ar = seq_len(N),
##'               phase = 0, angle = pi/(seq_len(N) + 2),
##'               size = 1:N + 5)
##' 
##' grid.newpage()
##' grid.draw(g2)
##' 
##' # ellipse
##' g3 <- ellipseGrob(unit(xy[,1],"cm") + unit(0.5,"npc"), 
##'                   unit(xy[,2],"cm") + unit(0.5,"npc"),
##'                   angle = -2*seq(0,N-1)*pi/5 + pi/2,
##'                   size = 5, ar = 1/3)
##' 
##' grid.newpage()
##' grid.draw(g3)
ngonGrob <- function (x, y, n = 5, size = 5, phase = pi/2, 
                      angle = 0, ar = 1,
                      gp = gpar(colour = "black", fill = NA, 
                                linejoin = "mitre"), ..., 
                      position.units = "npc", size.units="mm") 
{
  N <- length(x)
  stopifnot(length(y) == N)
  
  if (!is.unit(x)) 
    x <- unit(x, position.units)
  if (!is.unit(y)) 
    y <- unit(y, position.units)
  
  xv <- convertX(x, position.units, TRUE)
  yv <- convertY(y, position.units, TRUE)
  
  if (length(n) < N) 
    n <- rep(n, length.out = N)
  if (length(size) < N) 
    size <- rep(size, length.out = N)
  if (length(phase) < N) 
    phase <- rep(phase, length.out = N)
  if (length(angle) < N) 
    angle <- rep(angle, length.out = N)
  if (length(ar) < N) 
    ar <- rep(ar, length.out = N)
  
  lngon <- mapply(polygon_regular, n = n, phase = phase,
                  SIMPLIFY = FALSE)
  vertices <- sapply(lngon, nrow)
  
  stretch_rotate_move <- function(p, size, ar, angle, x, y){
    central <- size * p %*% 
      diag(c(sqrt(ar), 1/sqrt(ar))) %*%
      rbind(c(cos(angle), -sin(angle)), 
            c(sin(angle),  cos(angle)))
    
    list(x = unit(central[,1], size.units) + unit(x, position.units),
         y = unit(central[,2], size.units) + unit(y, position.units))
    
  }
  
  lxy <- mapply(stretch_rotate_move, p=lngon,
                size=size, ar=ar, angle=angle, 
                x=xv, y=yv,
                SIMPLIFY = FALSE)
  
  allx <- do.call("unit.c", lapply(lxy, "[[", 1))
  ally <- do.call("unit.c", lapply(lxy, "[[", 2))
  
  polygonGrob(allx, ally, id.lengths = vertices, gp = gp, ...)
  
}


#' @describeIn ngonGrob draw a polygon grob on the current device
#' @inheritParams ngonGrob
#' @export
grid.ngon <- function(...)
{
  grid.draw(ngonGrob(...))
}


#' @describeIn ngonGrob return an ellipse grob
#' @inheritParams ngonGrob
#' @export
ellipseGrob <- function(x, y, size = 5, 
                        angle = pi/4, ar = 1, n = 50, 
                        gp = gpar(colour = "black", fill = NA, 
                                  linejoin = "mitre"), ..., 
                        position.units = "npc", size.units="mm")  {
  
  ngonGrob(x, y, n = n , phase = 0, 
           size = size, angle = angle, ar = ar,
           gp = gp, position.units = position.units, 
           size.units = size.units, ...)
}


#' @describeIn ngonGrob draw an ellipse grob
#' @inheritParams ngonGrob
#' @export
grid.ellipse <- function(...)
{
  grid.draw(ellipseGrob(...))
}


#' @describeIn ngonGrob return the x,y coordinates of a regular polygon inscribed in the unit circle
#' @inheritParams ngonGrob
#' @export
polygon_regular <- function(n = 5, phase = 0){
  stopifnot(n > 2)
  cc <- exp(seq(0, n)*2i*pi/n) * exp(1i*(phase+pi/2))
  cbind(Re(cc), Im(cc))
}
