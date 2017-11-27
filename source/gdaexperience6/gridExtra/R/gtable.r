## Misc. gtable functions
## Note: some functions were copied from the gtable package with 
## minor modifications (rbind/cbind). In the future it would be nice to
## get them included in the original gtable package, but its development 
## cycle is not very regular.

##'Prints summary information on gtable objects
##'@param object a gtable
##'@param ... unused
##'@importFrom utils str
##'@method str gtable
##' @noRd
##'@export
str.gtable <- function(object, ...){
  cat(c("gtable, containing \ngrobs (", 
        length(object[["grobs"]]), ") :"), sep="")
  utils::str(vapply(object$grobs, as.character, character(1)))
  cat("layout :\n")
  utils::str(object[["layout"]])
  cat("widths :\nunit vector of length", 
      length(object[["widths"]]), "\n")
  cat("heights :\nunit vector of length", 
      length(object[["heights"]]), "\n")
  for(element in c("respect", "rownames", 
                   "name", "gp", "vp")){
    cat(element, ":\n")
    utils::str(object[[element]])
  }
}


##'Combine gtables based on row/column names.
##'@param ... gtables
#' @aliases combine
##'@rdname combine
##'@param along dimension to align along, \code{1} = rows,
##'\code{2} = cols. 
##'@param join when x and y have different names, how should the difference be resolved? 
##'\code{inner} keep names that appear in both, 
##'\code{outer} keep names that appear in either, 
##'\code{left} keep names from \code{x}, 
##'and \code{right} keep names from \code{y}.
##'@export
gtable_combine <- function (..., along = 1L, join = "outer") 
{
  gtables <- list(...)
  Reduce(function(x, y) combine_2(x, y, 
                                    along = along, 
                                    join = join),
         gtables)
}


#' @rdname combine
#' @export
combine <- function (..., along = 1L, join = "outer") {
  .Deprecated("gtable_combine")
  gtable_combine(..., along=along, join=join)
}


z_normalise <- function (x, i = 1) 
{
  x$layout$z <- rank(x$layout$z, ties.method = "first") + i - 
    1
  x
}

z_arrange_gtables <- function (gtables, z) 
{
  if (length(gtables) != length(z)) {
    stop("'gtables' and 'z' must be the same length")
  }
  zmax <- 0
  for (i in order(z)) {
    if (nrow(gtables[[i]]$layout) > 0) {
      gtables[[i]] <- z_normalise(gtables[[i]], zmax + 
                                    1)
      zmax <- max(gtables[[i]]$layout$z)
    }
  }
  gtables
}


##'rbind gtables
##'@rdname bind
##'@param ... gtables
##'@param size how should the widths be calculated?
##'\code{max} maximum of all widths
##'\code{min} minimum of all widths
##'\code{first} widths/heights of first gtable
##'\code{last} widths/heights of last gtable
##'@param z optional z level
##'@export
gtable_rbind <- function(..., size = "max", z = NULL) {
  gtables <- list(...)
  if (!is.null(z)) {
    gtables <- z_arrange_gtables(gtables, z)
  }
  Reduce(function(x, y) rbind_2(x, y, size = size), gtables)
}

##'cbind gtables
##'@rdname bind
##'@export
gtable_cbind <- function(..., size = "max", z = NULL) {
  gtables <- list(...)
  if (!is.null(z)) {
    gtables <- z_arrange_gtables(gtables, z)
  }
  Reduce(function(x, y) cbind_2(x, y, size = size), gtables)
}

rbind_2 <- function(x, y, size = "max") {
  stopifnot(ncol(x) == ncol(y))
  if (nrow(x) == 0) return(y)
  if (nrow(y) == 0) return(x)
  
  y$layout$t <- y$layout$t + nrow(x)
  y$layout$b <- y$layout$b + nrow(x)
  x$layout <- rbind(x$layout, y$layout)
  
  x$heights <- insert.unit(x$heights, y$heights)
  x$rownames <- c(x$rownames, y$rownames)
  
  size <- match.arg(size, c("first", "last", 
                            "max", "min"))
  x$widths <- switch(size,
                     first = x$widths,
                     last = y$widths,
                     min = unit.pmin(x$widths, y$widths),
                     max = unit.pmax(x$widths, y$widths)
  )
  
  x$grobs <- append(x$grobs, y$grobs)
  
  x
}

cbind_2 <- function(x, y, size = "max") {
  stopifnot(nrow(x) == nrow(y))
  if (ncol(x) == 0) return(y)
  if (ncol(y) == 0) return(x)
  
  y$layout$l <- y$layout$l + ncol(x)
  y$layout$r <- y$layout$r + ncol(x)
  x$layout <- rbind(x$layout, y$layout)
  
  x$widths <- insert.unit(x$widths, y$widths)
  x$colnames <- c(x$colnames, y$colnames)
  
  size <- match.arg(size, c("first", "last", 
                            "max", "min"))
  
  x$heights <- switch(size,
                      first = x$heights,
                      last = y$heights,
                      min = unit.pmin(x$heights, y$heights),
                      max = unit.pmax(x$heights, y$heights))
  
  x$grobs <- append(x$grobs, y$grobs)
  
  x
}


combine_2 <- function(x, y, along = 1L, join = "outer") {
  aligned <- align_2(x, y, along = along, join = join)
  switch(along,
         cbind_2(aligned$x, aligned$y, 
                                  size="max"), 
         rbind_2(aligned$x, aligned$y, 
                                  size="max"),
         stop("along > 2 no implemented"))
}



align_2 <- function(x, y, along = 1L, join = "outer") {
  join <- match.arg(join, c("left", "right", "inner", "outer"))
  
  names_x <- dimnames(x)[[along]]
  names_y <- dimnames(y)[[along]]
  
  if (is.null(names_x) || is.null(names_y)) {
    stop("Both gtables must have names along dimension to be aligned")
  }
  
  idx <- switch(join,
                left = names_x,
                right = names_y, 
                inner = intersect(names_x, names_y),
                outer = union(names_x, names_y)
  )
  
  list(
    x = gtable_reindex(x, idx, along), 
    y = gtable_reindex(y, idx, along)
  )
}


gtable_reindex <- function(x, index, along = 1L) {
  stopifnot(is.character(index))
  if (length(dim(x)) > 2L || along > 2L) {
    stop("reindex only supports 2d objects")
  }
  old_index <- switch(along, rownames(x), colnames(x))
  stopifnot(!is.null(old_index))
  
  if (identical(index, old_index)) {
    return(x)
  }
  
  if (!(old_index %contains% index)) {
    missing <- setdiff(index, old_index)
    # Create and add dummy space rows
    
    if (along == 1L) {
      spacer <- gtable(
        widths = unit(rep(0, ncol(x)), "cm"), 
        heights = rep_along(unit(0, "cm"), missing),
        rownames = missing)
      x <- rbind(x, spacer, size = "first")
    } else if (along == 2L){
      spacer <- gtable(
        heights = unit(rep(0, nrow(x)), "cm"), 
        widths = rep_along(unit(0, "cm"), missing),
        colnames = missing)
      
      x <- cbind(x, spacer, size = "first")
    }
  }
  
  
  # Reorder & subset
  
  switch(along, 
         x[index, ],
         x[, index])
}


gtable_remove_grob <- function(x, pattern, which = 1L, 
                               fixed = FALSE, trim=TRUE){
  matches <- grep(pattern, x$layout$name, fixed = fixed)
  tokeep <- setdiff(seq_len(length(x)), matches[which])
  x$layout <- x$layout[tokeep, , drop = FALSE]
  x$grobs <- x$grobs[tokeep]
  if(trim)
    x <- gtable_trim(x)
  x
}


## misc utils

"%contains%" <- function(x, y) all(y %in% x)

rep_along <- function(x, y) {
  if (length(y) == 0) return(NULL)
  rep(x, length(y))
}


insert.unit <- function (x, values, after = length(x)) {
  lengx <- length(x)
  if (lengx == 0) return(values)
  if (length(values) == 0) return(x)
  
  if (after <= 0) {
    unit.c(values, x)
  } else if (after >= lengx) {
    unit.c(x, values)
  } else {
    unit.c(x[1L:after], values, x[(after + 1L):lengx])
  }
}
