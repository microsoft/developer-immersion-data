#' @aliases grid.table tableGrob ttheme_default ttheme_minimal
#' @title Graphical display of a textual table
#' @describeIn tableGrob return a grob
#' @description Create a gtable containing text grobs representing a character matrix.
#' @param d data.frame or matrix
#' @param rows optional vector to specify row names
#' @param cols optional vector to specify column names
#' @param theme list of theme parameters
#' @param vp optional viewport
#' @param ... further arguments to control the gtable
#' @return A gtable.
#' @export
#' @examples
#' library(grid)
#' d <- head(iris, 3)
#' g <- tableGrob(d)
#' grid.newpage()
#' grid.draw(g)
tableGrob <- function(d, rows=rownames(d), cols=colnames(d), 
                      theme = ttheme_default(), vp = NULL,
                      ...){
  
  
  g <- gtable_table(d, name="core",
                    fg_fun = theme$core$fg_fun, 
                    bg_fun = theme$core$bg_fun, 
                    fg_params = theme$core$fg_params, 
                    bg_params = theme$core$bg_params, 
                    padding=theme$core$padding, ...)
  
  if(!is.null(cols)){
    gc <- gtable_table(t(cols), name="colhead",
                       fg_fun = theme$colhead$fg_fun, 
                       bg_fun = theme$colhead$bg_fun, 
                       fg_params = theme$colhead$fg_params, 
                       bg_params = theme$colhead$bg_params, 
                       padding=theme$colhead$padding)
    g <- rbind_2(gc, g, "max")
  }
  if(!is.null(rows)){
    if(!is.null(cols)) # need to add dummy cell
      rows <- c("", rows)
    gr <- gtable_table(rows, name="rowhead",
                       fg_fun = theme$rowhead$fg_fun, 
                       bg_fun = theme$rowhead$bg_fun, 
                       fg_params = theme$rowhead$fg_params, 
                       bg_params = theme$rowhead$bg_params,
                       padding=theme$rowhead$padding)
    g <- cbind_2(gr, g, "max")
  }
  
  colnames(g) <- paste0("c", seq_len(ncol(g)))
  rownames(g) <- paste0("r", seq_len(nrow(g)))
  
  if(!is.null(vp)) g$vp <- vp
  g
}

#' @describeIn tableGrob draw a text table
#' @inheritParams tableGrob
#' @export
grid.table <- function(...)
  grid.draw(tableGrob(...))


#' @describeIn tableGrob default theme for text tables
#' @param base_size default font size
#' @param base_colour default font colour
#' @param base_family default font family
#' @param parse logical, default behaviour for parsing text as plotmath
#' @param padding length-2 unit vector specifying the horizontal and vertical padding of text within each cell
#' @importFrom utils modifyList
#' @export
ttheme_default <- function(base_size=12, 
                           base_colour="black", 
                           base_family="",
                           parse=FALSE, 
                           padding = unit(c(4, 4), "mm"), ...){
  
  core <- list(fg_fun = text_grob, 
               fg_params = list(parse=parse, col=base_colour,
                                fontsize = base_size,
                                fontfamily = base_family),
               bg_fun = rect_grob, 
               bg_params = list(fill = c("grey95","grey90"), 
                                lwd=1.5, col="white"),
               padding = padding)
  
  colhead <- list(fg_fun = text_grob, 
                  fg_params = list(parse=parse, col=base_colour,
                                   fontface=2L,
                                   fontsize = base_size,
                                   fontfamily = base_family),
                  bg_fun = rect_grob, 
                  bg_params = list(fill = c("grey80"), 
                                   lwd=1.5, col="white"),
                  padding = padding)
  
  rowhead <- list(fg_fun = text_grob, 
                  fg_params = list(parse=parse, col=base_colour,
                                   fontface=3L,
                                   fontsize = base_size,
                                   fontfamily = base_family,
                                   hjust = 1, x = 0.95),
                  bg_fun = rect_grob, 
                  bg_params = list(fill=NA, lwd=1.5, col="white"),
                  padding = padding)
  
  default <- list(
    core = core,
    colhead = colhead,
    rowhead= rowhead
  )
  
  modifyList(default, list(...))
  
}


#' @describeIn tableGrob minimalist theme for text tables
#' @inheritParams ttheme_default
##' @export
ttheme_minimal <- function(base_size=12, 
                           base_colour = "black", 
                           base_family = "",
                           parse=FALSE,
                           padding = unit(c(4, 4), "mm"),
                           ...){
  
  core <- list(fg_fun = text_grob, 
               fg_params = list(parse=parse, col=base_colour,
                                fontsize = base_size,
                                fontfamily = base_family),
               bg_fun = rect_grob, 
               bg_params = list(fill = NA, col=NA),
               padding = padding)
  
  colhead <- list(fg_fun = text_grob, 
                  fg_params = list(parse=parse, col=base_colour,
                                   fontface=2L,
                                   fontsize = base_size,
                                   fontfamily = base_family),
                  bg_fun = rect_grob, 
                  bg_params = list(fill = NA, col=NA),
                  padding = padding)
  
  rowhead <- list(fg_fun = text_grob, 
                  fg_params = list(parse=parse, col=base_colour,
                                   fontface=3L,
                                   fontsize = base_size, 
                                   fontfamily = base_family,
                                   hjust = 1, x = 0.95),
                  bg_fun = rect_grob, 
                  bg_params = list(fill=NA, col=NA),
                  padding = padding)
  
  default <- list(
    core = core,
    colhead = colhead,
    rowhead= rowhead
  )
  
  modifyList(default, list(...))
  
}



##
## unexported helper functions
##
gtable_table <- function(d, widths, heights,
                         fg_fun = text_grob, fg_params = list(),
                         bg_fun = rect_grob, bg_params = list(),
                         padding = unit(c(4, 4), "mm"),
                         name = "table", vp = NULL){
  
  label_matrix <- as.matrix(d)
  
  nc <- ncol(label_matrix)
  nr <- nrow(label_matrix)
  n <- nc*nr
  
  ## formatting parameters will be recycled iff 
  ## there are fewer elements than needed
  rep_ifshort <- function(x, n, nc, nr){
      if(length(x) >= n){
        return(x[1:n]) } else # recycle 
            return(rep(rep(x, length.out = nr), length.out= n)) 
  }
  
  fg_params <- lapply(fg_params, rep_ifshort, n = n, nc = nc, nr = nr)
  bg_params <- lapply(bg_params, rep_ifshort, n = n, nc = nc, nr = nr)
  
  fg_params <- data.frame(fg_params, 
                          label = as.vector(label_matrix), # colwise
                          stringsAsFactors=FALSE)
  
  bg_params <- data.frame(bg_params, stringsAsFactors=FALSE)
  
  labels <- do.call(mapply, c(fg_params, list(FUN = fg_fun, 
                                              SIMPLIFY=FALSE)))
  bkgds <- do.call(mapply, c(bg_params, list(FUN = bg_fun, 
                                             SIMPLIFY=FALSE)))

  label_grobs <- matrix(labels, ncol = nc, byrow = FALSE)
  bkgds_grobs <- matrix(bkgds, ncol = nc, byrow = FALSE)
  
  ## some calculations of cell sizes
  
  if(missing(widths))
    widths <- col_widths(label_grobs) + padding[1]
  if(missing(heights))
    heights <- row_heights(label_grobs) + padding[2]
  
  ## place labels in a gtable
  g <- gtable_matrix(paste0(name, "-fg"), 
                     grobs = label_grobs, 
                     widths = widths, 
                     heights = heights, vp=vp)
  
  ## add the background
  g <- gtable_add_grob(g, bkgds_grobs, 
                       t=rep(seq_len(nr), length.out = n), 
                       l=rep(seq_len(nc), each = nr), z=0, 
                       name=paste0(name, "-bg"))
  
  g
}
