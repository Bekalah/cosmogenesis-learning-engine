using Arch.Core;
using Arch.Core.Extensions;

namespace Cosmogenesis.Core.Ecs
{
    /// <summary>
    /// Provides a shared Arch ECS world seeded with a simple motion archetype.
    /// This bootstrap is shared by both Stride and MonoGame sandboxes so we can
    /// observe behavior without duplicating code across renderers.
    /// </summary>
    public static class ArchWorld
    {
        public struct Position
        {
            public float X;
            public float Y;
        }

        public struct Velocity
        {
            public float X;
            public float Y;
        }

        /// <summary>
        /// Creates the world and seeds an entity with position + velocity for perf probes.
        /// </summary>
        public static World Create()
        {
            var world = World.Create();
            world.Create(new Position(), new Velocity { X = 0.1f });
            return world;
        }
    }
}
