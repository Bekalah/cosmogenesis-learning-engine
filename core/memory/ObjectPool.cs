using System.Collections.Generic;

namespace Cosmogenesis.Core.Memory
{
    /// <summary>
    /// Simple shared object pool for reuse across Stride and MonoGame sandboxes.
    /// Pools help limit GC churn during perf profiling sessions.
    /// </summary>
    /// <typeparam name="T">Type to pool. Requires a public parameterless constructor.</typeparam>
    public sealed class ObjectPool<T> where T : new()
    {
        private readonly Stack<T> _stack = new();

        public T Get()
        {
            return _stack.Count > 0 ? _stack.Pop() : new T();
        }

        public void Return(T item)
        {
            _stack.Push(item);
        }
    }
}
