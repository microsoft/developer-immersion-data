# CONCLUSION

As you already know, a system that grows daily with new data ingestion is bound to run into performance issues sooner or later. SQL Server 2016 now provides you with a new tool, In-Memory ColumnStore indexes, which allows you to improvement the time a query takes as well as the number of I/O operations, specially useful in data warehousing and analysis,

During this lab, you've learned how to apply an In-Memory ColumnStore index to an existing table, as well as measure an analysis of the performance increases this implies.

With Columnstore indexes we can achieve high query performance by combining high-speed in-memory batch mode processing with techniques that reduce I/O requirements. The magic behind this is a combination of different concepts:

 - data compresion: achieve up to 10x greater data compression than rowstore indexes.
 - column elimination: skip reading in columns that are not required for the query results.
 - rowgroup elimination: by using metadata, the columnstore index is able to skip reading in the rowgroups that do not contain data required for the query result, all without actual IO.

The reduction in the number of I/O operations will allow us to have better results when performing parallel operations.

<a href="..\README.md">Next</a>