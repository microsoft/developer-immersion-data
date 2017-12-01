##' @aliases grid.arrange arrangeGrob marrangeGrob
##' @title Arrange multiple grobs on a page
##' @description Set up a gtable layout to place multiple grobs on a page.
##' @describeIn arrangeGrob return a grob without drawing
##' @param ...  grobs, gtables, ggplot or trellis objects
##' @param grobs list of grobs
##' @param top optional string, or grob
##' @param bottom optional string, or grob
##' @param left optional string, or grob
##' @param right optional string, or grob
##' @param padding unit of length one, margin around annotations
##' @param as.table logical: bottom-left to top-right (TRUE) or top-left to bottom-right (FALSE)
##' @param layout_matrix optional layout
##' @param name argument of gtable
##' @param respect argument of gtable
##' @param clip argument of gtable
##' @param nrow argument of gtable
##' @param ncol argument of gtable
##' @param widths argument of gtable
##' @param heights argument of gtable
##' @param vp viewport
##' @return arrangeGrob returns a gtable.
##' @import gtable
##' @import grid
##' @importFrom grDevices n2mfrow
##' @export
##' 
##' @examples
##' library(grid)
##' grid.arrange(rectGrob(), rectGrob())
arrangeGrob <- function(..., grobs=list(...), 
                        layout_matrix, 
                        vp=NULL, name = "arrange",
                        as.table=TRUE, 
                        respect = FALSE, clip = "off",
                        nrow=NULL, ncol=NULL, 
                        widths = NULL, heights = NULL,
                        top = NULL, bottom = NULL, 
                        left = NULL, right = NULL,
                        padding = unit(0.5,"line")){
  
  n <- length(grobs)
  
  ## logic for the layout
  # if nrow/ncol supplied, honour this
  # if not, use length of widths/heights, if supplied
  # if nothing supplied, work out sensible defaults
  
  ## nothing to be done but check inconsistency
  if (!is.null(ncol) && !is.null(widths)){
    stopifnot(length(widths) == ncol)
  }
  if (!is.null(nrow) && !is.null(heights)){
    stopifnot(length(heights) == nrow)
  }
  ## use widths/heights if supplied
  if (is.null(ncol) && !is.null(widths)){
    ncol <- length(widths)
  }
  if (is.null(nrow) && !is.null(heights)){
    nrow <- length(heights)
  }
  ## work out the missing one
  if(is.null(nrow) && !is.null(ncol)) {
    nrow <- ceiling(n/ncol)
  }
  if(is.null(ncol) && !is.null(nrow)) {
    ncol <- ceiling(n/nrow)
  }
  
  ## it may happen that sufficient info was passed,
  ## but incompatible with number of grobs (fewer cells)
  stopifnot(nrow*ncol >= n)
  
  ## last case: nothing exists
  if(is.null(nrow) && is.null(ncol) && 
     is.null(widths) && is.null(heights)) 
  {
    nm <- grDevices::n2mfrow(n)
    nrow = nm[1]
    ncol = nm[2]
  }
  
  ## debugging
  # message("nrow:", nrow, " ncol:", ncol)
  
  ## conversions
  inherit.ggplot <-  unlist(lapply(grobs, inherits, what="ggplot"))
  inherit.trellis <- unlist(lapply(grobs, inherits, what="trellis"))
  if(any(inherit.ggplot)) {
    stopifnot(requireNamespace("ggplot2", quietly = TRUE)) 
    toconv <- which(inherit.ggplot)
    grobs[toconv] <- lapply(grobs[toconv], ggplot2::ggplotGrob)
  }
  if(any(inherit.trellis)) {
    stopifnot(requireNamespace("lattice", quietly = TRUE)) 
    toconv <- which(inherit.trellis)
    grobs[toconv] <- lapply(grobs[toconv], latticeGrob)
  }
  
  if(missing(layout_matrix)){ # default layout: one cell for each grob
    
    positions <- expand.grid(t = seq_len(nrow), 
                             l = seq_len(ncol))
    positions$b <- positions$t
    positions$r <- positions$l
    if(as.table) # fill table by rows
      positions <- positions[order(positions$t),]
    
    positions <- positions[seq_along(grobs), ] # n might be < ncol*nrow
    
  } else { # a layout was supplied
    
    cells <- sort(unique(as.vector(layout_matrix)))
    ## left/right/top/bottom borders for given id
    range_cell <- function(ii){
      ind <- which(layout_matrix == ii, arr.ind=TRUE)
      c(l=min(ind[,"col"], na.rm = TRUE),
        r=max(ind[,"col"], na.rm = TRUE),
        t=min(ind[,"row"], na.rm = TRUE),
        b=max(ind[,"row"], na.rm = TRUE))
    }
    positions <- data.frame(do.call(rbind, lapply(cells, range_cell)))

    ncol <- max(positions$r)
    nrow <- max(positions$b)
    positions <- positions[seq_along(grobs),] # layout might define more cells 
  }
  
  ## sizes
  if(is.null(widths)) widths <- unit(rep(1, ncol), "null")
  if(is.null(heights)) heights <- unit(rep(1,nrow), "null")
  
  ## lazy size specification as relative numbers
  if (!is.unit(widths))  widths <- unit(widths, "null")
  if (!is.unit(heights)) heights <- unit(heights, "null")
  
  ## build the gtable, similar steps to gtable_matrix
  gt <- gtable(name=name, 
               respect = respect,
               heights = heights, 
               widths = widths, 
               vp=vp)
  
  gt <- gtable_add_grob(gt, grobs, 
                        t = positions$t, 
                        b = positions$b,
                        l = positions$l,
                        r = positions$r, 
                        z = seq_along(grobs),
                        clip = clip)
  
  ## titles given as strings are converted to text grobs
  if(is.character(top)){
    top <- textGrob(top)
  }
  if(is.grob(top)){
    h <- grobHeight(top) + padding
    gt <- gtable_add_rows(gt, heights=h, 0)
    gt <- gtable_add_grob(gt, top, t=1, l=1, r=ncol(gt), z=Inf,
                          clip = clip)
  }
  if(is.character(bottom)){    
    bottom <- textGrob(bottom)
  }
  if(is.grob(bottom)){
    h <- grobHeight(bottom) + padding
    gt <- gtable_add_rows(gt, heights = h, -1)
    gt <- gtable_add_grob(gt, bottom, 
                          t=nrow(gt), l=1, r=ncol(gt), z=Inf,
                          clip = clip)
  }
  if(is.character(left)){
    left <- textGrob(left, rot = 90)
  }
  if(is.grob(left)){
    w <- grobWidth(left) + padding
    gt <- gtable_add_cols(gt, widths=w, 0)
    gt <- gtable_add_grob(gt, left, t=1, b=nrow(gt), 
                          l=1, r=1, z=Inf,
                          clip = clip)
  }
  if(is.character(right)){
    right <- textGrob(right, rot = -90)
  }
  if(is.grob(right)){
    w <- grobWidth(right) + padding
    gt <- gtable_add_cols(gt, widths=w, -1)
    gt <- gtable_add_grob(gt, right, 
                          t=1, b=nrow(gt), 
                          l=ncol(gt), r=ncol(gt), z=Inf,
                          clip = clip)
  }
  
  gt
}

##' @describeIn arrangeGrob draw on the current device
##' @param newpage open a new page
##' @inheritParams arrangeGrob
##' @export
grid.arrange <- function(..., newpage=TRUE){
    if(newpage) grid.newpage()
    g <- arrangeGrob(...)
    grid.draw(g)
    invisible(g)
}


##' @describeIn arrangeGrob interface to arrangeGrob that can dispatch on multiple pages
##' @details Using marrangeGrob, if the layout specifies both nrow and ncol, the list of grobs can be split into multiple pages. On interactive devices print opens new windows, whilst non-interactive devices such as pdf call grid.newpage() between the drawings.
##' @return marrangeGrob returns a list of class arrangelist
##' @export
##' @examples
##' \dontrun{ 
##' library(ggplot2)
##' pl <- lapply(1:11, function(.x) qplot(1:10, rnorm(10), main=paste("plot", .x)))
##' ml <- marrangeGrob(pl, nrow=2, ncol=2)
##' ## non-interactive use, multipage pdf
##' ggsave("multipage.pdf", ml)
##' ## interactive use; open new devices
##' ml
##' }
marrangeGrob <- function(grobs, 
                         ..., ncol, nrow,
                         layout_matrix = matrix(seq_len(nrow*ncol), 
                                                nrow = nrow, ncol=ncol),
                         top = quote(paste("page", g, "of", npages))){
  
  n <- length(grobs)
  nlay <-  max(layout_matrix, na.rm=TRUE)
  npages <-  n %/% nlay + as.logical(n %% nlay)
  groups <- split(grobs, rep(seq_len(npages), each=nlay, length.out=n))
  
  pl <- vector(mode = "list", length = npages)
  
  for(g in seq_along(groups)){
    params <- modifyList(list(...), 
                         list(top=eval(top), layout_matrix = layout_matrix))
    pl[[g]] <- do.call(arrangeGrob, c(list(grobs=groups[[g]]), params))
  }
  
  class(pl) <- c("arrangelist", class(pl))
  pl
  
}


##' @noRd
##' @importFrom grDevices dev.interactive dev.new
##' @export
grid.draw.arrangelist = function(x, ...) lapply(x, function(.x) {
  if(dev.interactive()) dev.new() else grid.newpage()
  grid.draw(.x)
}, ...)

##' @noRd
##' @importFrom grDevices dev.interactive dev.new
##' @export
print.arrangelist = function(x, ...) lapply(x, function(.x) {
  if(dev.interactive()) dev.new() else grid.newpage()
  grid.draw(.x)
}, ...)
