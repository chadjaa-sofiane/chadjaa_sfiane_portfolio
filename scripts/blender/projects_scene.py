"""Procedural build of the /projects hero: a small workshop on the home hero's plinth.

    blender -b --factory-startup --python scripts/blender/projects_scene.py -- \
        --out .cache/projects-3d [--poster] [--blend .cache/projects-3d/projects.blend]

Produces projects.glb (+ poster.png with --poster). Built from the same
helpers, materials, plinth, camera and lights as hero_scene.py.

Conventions the web side relies on (containers/Projects/ProjectsHero):
  * each clickable piece lives under an un-animated empty hot_<id> carrying
    custom props `target` (a page anchor id) and `label`; the client lifts it
    on hover and scrolls to #target on click;
  * one action, "intro", assembles everything and is played once;
  * idle="spin" and material "glow" behave as in the home hero.
"""

import argparse
import math
import os
import sys

import bpy
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import hero_scene as h  # noqa: E402

MAT = h.MAT


def glass():
    mat = h.material("glass", "#cfe6e2", 0.08)
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Alpha"].default_value = 0.28
    try:
        mat.surface_render_method = "BLENDED"
    except AttributeError:
        mat.blend_method = "BLEND"
    return mat


def hotspot(name, loc, target, label, rot_z=0.0):
    root = h.empty(f"hot_{name}", loc, rot=(0, 0, math.radians(rot_z)))
    root["target"] = target
    root["label"] = label
    return root


def build_web(c):
    """Back: a browser window with a site on it -> My projects."""
    hot = hotspot("web", (-0.45, 0.45, 0), "projects-grid", "Websites & apps", rot_z=45)
    win = h.empty("web_window", parent=hot)
    win.scale = (0.98, 0.98, 0.98)
    foot = h.cyl("web_foot", 0.34, 0.06, (0, 0, 0), MAT["slate"], bevel=0.02, parent=win, base_origin=True)
    neck = h.box("web_neck", (0.12, 0.12, 0.42), (0, 0.06, 0.24), MAT["slate"], bevel=0.02, parent=win)
    c.pop(foot, 0, dur=8)
    c.pop(neck, 3, dur=8)
    frame = h.box("web_frame", (1.9, 0.1, 1.24), (0, 0, 1.06), MAT["ivory"], bevel=0.05, parent=win)
    c.pop(frame, 6, dur=12, overshoot=1.06)
    screen = h.box("web_screen", (1.76, 0.02, 0.98), (0, -0.055, 1.01), MAT["ink"], bevel=0, parent=win)
    c.pop(screen, 12, dur=8)
    for i, color in enumerate(("copper", "sage", "teal")):
        dot = h.cyl(f"web_dot_{i}", 0.032, 0.02, (-0.8 + i * 0.09, -0.06, 1.59), MAT[color], verts=16, bevel=0,
                    parent=win, rot=(math.radians(90), 0, 0))
        c.pop(dot, 16 + i * 2, dur=6)
    banner = h.box("web_banner", (1.54, 0.03, 0.3), (0, -0.07, 1.3), MAT["teal"], bevel=0.015, parent=win)
    c.pop(banner, 20, dur=9)
    for i, x in enumerate((-0.52, 0.0, 0.52)):
        card = h.box(f"web_card_{i}", (0.44, 0.03, 0.4), (x, -0.07, 0.86), MAT["slate"], bevel=0.015, parent=win)
        c.pop(card, 26 + i * 3, dur=8)
        line = h.box(f"web_line_{i}", (0.3, 0.035, 0.04), (x, -0.075, 0.96), MAT["ivory"], bevel=0, parent=win)
        c.pop(line, 29 + i * 3, dur=6)


def build_laptop(c):
    """Left: a laptop training a model -> My projects."""
    hot = hotspot("ml", (-1.05, -0.5, 0), "projects-grid", "Machine learning", rot_z=-135)
    base = h.box("ml_base", (0.95, 0.66, 0.06), (0, 0, 0.03), MAT["slate"], bevel=0.025, parent=hot)
    c.drop(base, 14, height=1.0, dur=10)
    keys = h.box("ml_keys", (0.8, 0.36, 0.012), (0, 0.06, 0.065), MAT["ink"], bevel=0, parent=hot)
    c.pop(keys, 22, dur=6)
    lid = h.empty("ml_lid", (0, -0.31, 0.06), parent=hot, rot=(math.radians(14), 0, 0))
    shell = h.box("ml_shell", (0.95, 0.04, 0.62), (0, -0.02, 0.31), MAT["slate"], bevel=0.02, parent=lid)
    c.pop(shell, 24, dur=8)
    panel = h.box("ml_panel", (0.84, 0.01, 0.52), (0, 0.005, 0.32), MAT["ink"], bevel=0, parent=lid)
    c.pop(panel, 28, dur=6)
    # A falling loss curve as bars, tallest first.
    for i, height in enumerate((0.36, 0.25, 0.17, 0.12, 0.09, 0.075)):
        bar = h.box(f"ml_bar_{i}", (0.08, 0.014, height), (-0.3 + i * 0.12, 0.012, 0.12 + height / 2),
                    MAT["copper"] if i == 0 else MAT["teal"], bevel=0.004, parent=lid)
        c.pop(bar, 32 + i * 2, dur=6)
    orb = h.sphere("ml_orb", 0.1, (0, -0.25, 1.0), MAT["ember"], parent=hot)
    c.pop(orb, 46, dur=10, overshoot=1.4)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.22, minor_radius=0.01, major_segments=64,
                                     minor_segments=6, location=(0, -0.25, 1.0))
    ring = h._smooth(h.finish(bpy.context.active_object, "ml_ring", MAT["sage"], smooth=False, parent=hot))
    ring.rotation_euler = (math.radians(70), 0, 0)
    h.idle_spin(ring, 0.9)
    c.pop(ring, 50, dur=10)


def build_rack(c):
    """Right: the production rack with a payment shield -> featured work."""
    hot = hotspot("prod", (1.15, 0.55, 0), "in-production", "Production work", rot_z=45)
    rack = h.box("prod_rack", (0.7, 0.6, 1.5), (0, 0, 0.75), MAT["slate"], bevel=0.045, parent=hot)
    c.drop(rack, 8, height=1.5)
    for i in range(5):
        z = 0.26 + i * 0.26
        blade = h.box(f"prod_blade_{i}", (0.58, 0.08, 0.18), (0, -0.29, z), MAT["ivory"], bevel=0.02, parent=hot)
        c.slide(blade, 18 + i * 3, (0, 0.45, 0), dur=8)
        led = h.box(f"prod_led_{i}", (0.06, 0.03, 0.045), (0.2, -0.335, z), MAT["glow"], bevel=0.008, parent=hot)
        c.pop(led, 26 + i * 3, dur=6)
    shield = h.extruded("prod_shield", [(0, 0.5), (0.4, 0.38), (0.36, -0.1), (0, -0.5), (-0.36, -0.1), (-0.4, 0.38)],
                        0.07, (0, 0, 1.92), MAT["copper"], parent=hot, scale=0.5,
                        rot=(math.radians(90), 0, 0), bevel=0.012)
    h.idle_spin(shield, 0.7)
    c.pop(shield, 44, dur=12, overshoot=1.25)


def build_flask(c, glass_mat):
    """Front: a bubbling flask -> Lab."""
    hot = hotspot("lab", (0.35, -0.85, 0), "lab", "Lab experiments")
    bpy.ops.mesh.primitive_cone_add(vertices=40, radius1=0.42, radius2=0.12, depth=0.62, location=(0, 0, 0.31))
    body = h.finish(bpy.context.active_object, "lab_body", glass_mat, bevel=0.04, parent=hot)
    c.pop(body, 20, dur=10)
    bpy.ops.mesh.primitive_cone_add(vertices=40, radius1=0.38, radius2=0.22, depth=0.3, location=(0, 0, 0.17))
    liquid = h.finish(bpy.context.active_object, "lab_liquid", MAT["glow"], bevel=0.02, parent=hot)
    c.pop(liquid, 26, dur=8)
    neck = h.cyl("lab_neck", 0.12, 0.34, (0, 0, 0.6), glass_mat, bevel=0.01, parent=hot, base_origin=True)
    c.pop(neck, 24, dur=8)
    lip = h.cyl("lab_lip", 0.15, 0.04, (0, 0, 0.93), MAT["ivory"], bevel=0.015, parent=hot, base_origin=True)
    c.pop(lip, 30, dur=6)
    bubbles = h.empty("lab_bubbles", (0, 0, 0), parent=hot)
    h.idle_spin(bubbles, 1.1)
    for i, (r, x, z) in enumerate(((0.06, 0.04, 1.12), (0.045, -0.06, 1.3), (0.035, 0.05, 1.46))):
        bubble = h.sphere(f"lab_bubble_{i}", r, (x, 0.02 * i, z), MAT["glow"], parent=bubbles)
        c.pop(bubble, 36 + i * 4, dur=8, overshoot=1.5)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", required=True)
    parser.add_argument("--poster", action="store_true")
    parser.add_argument("--blend")
    args = parser.parse_args(argv)
    os.makedirs(args.out, exist_ok=True)

    bpy.ops.wm.read_factory_settings(use_empty=True)
    h.build_materials()
    glass_mat = glass()
    h.configure_render()
    h.build_plinth()
    c = h.Choreo("intro")
    build_web(c)
    build_laptop(c)
    build_rack(c)
    build_flask(c, glass_mat)
    cam = h.build_camera()
    cam.location = Vector((0, 0, 0.5)) + Vector((1, -1, 0.72)).normalized() * 9.6
    cam.rotation_quaternion = (Vector((0, 0, 0.5)) - cam.location).to_track_quat("-Z", "Y")
    h.build_lights()

    scene = bpy.context.scene
    scene.frame_start = 0
    scene.frame_end = c.end
    print(f"[projects] intro {c.end / h.FPS:.2f}s")

    glb = os.path.join(args.out, "projects.glb")
    bpy.ops.export_scene.gltf(
        filepath=glb, export_format="GLB", export_apply=True, export_cameras=True,
        export_lights=False, export_extras=True, export_yup=True, export_animations=True,
        export_animation_mode="ACTIONS", export_force_sampling=True, export_frame_step=1,
        export_optimize_animation_size=True, export_materials="EXPORT", export_texcoords=False,
    )
    print(f"[projects] wrote {glb}")

    if args.blend:
        bpy.ops.wm.save_as_mainfile(filepath=args.blend, compress=True)

    if args.poster:
        scene.frame_set(c.end)
        scene.render.filepath = os.path.join(args.out, "poster.png")
        bpy.ops.render.render(write_still=True)
        print("[projects] rendered poster.png")


if __name__ == "__main__":
    main()
