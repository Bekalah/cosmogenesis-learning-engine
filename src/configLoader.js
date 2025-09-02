export function loadFirstDemo() {
  return {
    version: "0.9.2",
    palette_id: "gonzalez-obsidian",
    motion: { gentle_wobble: 0, hz: 0.25 },
    plate: {
      spiral: { a: 1, b: 0.18, theta_max: 12, points: 600 },
      halos: 3, halo_radius: 0.2, axis_deg: 23.5,
      ladder: { enabled: false, vertebrae: 33, thickness: 0.004 }
    }
  };
}
