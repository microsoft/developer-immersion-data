using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;

namespace GraphDataUploaderSample
{
    public static class EnumerableExtensions
    {
        public static Task AsyncParallelForEach<T>(this IEnumerable<T> source, 
            Func<T, Task> body, int maxDegreeOfParallelism = 
            DataflowBlockOptions.Unbounded, TaskScheduler scheduler = null)
        {
            var options = new ExecutionDataflowBlockOptions
            {
                MaxDegreeOfParallelism = maxDegreeOfParallelism
            };

            if (scheduler != null)
            {
                options.TaskScheduler = scheduler;
            }

            var block = new ActionBlock<T>(body, options);

            foreach (var item in source)
            {
                block.Post(item);
            }

            block.Complete();
            return block.Completion;
        }
    }
}
