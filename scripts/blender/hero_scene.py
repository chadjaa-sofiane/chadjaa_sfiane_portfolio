"""Procedural build of the home-page hero diorama.

Run from WSL (the `blender` shim in ~/.local/bin forwards to the Windows build):

    blender -b --factory-startup --python scripts/blender/hero_scene.py -- \
        --out public/3d [--posters] [--blend assets/3d/hero.blend]

Produces:
  hero.glb           one shared plinth + five role dioramas (role_<id> nodes),
                     the framing camera, and one baked animation per role.
  poster-<id>.png    Cycles stills of each finished diorama (with --posters);
                     scripts/build-hero-3d.mjs converts them to webp.

Conventions the web side relies on (containers/Home/HeroScene):
  * every role lives under an un-animated empty called role_<id>;
  * each role has exactly one action, named <id>, played forward to assemble
    and in reverse to disassemble. Before its first key every part is scaled
    to ~0, so frame 0 is an empty plinth;
  * custom property idle="spin" marks parts the client rotates about their
    local up axis once assembled. Idle parts are never rotation-keyed here.
  * material "glow" is the only emissive accent; the client pulses it.
"""

import argparse
import math
import os
import sys

import bmesh
import bpy
from mathutils import Matrix, Quaternion, Vector

FPS = 30
TINY = 0.001
ROLES = ("hero", "backend", "frontend", "ml", "devops")


# --------------------------------------------------------------------------
# Scene setup
# --------------------------------------------------------------------------

def srgb_to_linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def hex_rgba(value):
    value = value.lstrip("#")
    rgb = [srgb_to_linear(int(value[i:i + 2], 16) / 255) for i in (0, 2, 4)]
    return (*rgb, 1.0)


def material(name, color, roughness=0.5, metallic=0.0, emission=None, strength=0.0):
    mat = bpy.data.materials.new(name)
    if not mat.use_nodes:
        mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = hex_rgba(color)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if emission:
        bsdf.inputs["Emission Color"].default_value = hex_rgba(emission)
        bsdf.inputs["Emission Strength"].default_value = strength
    return mat


# Palette mirrors styles/abstracts/_colors.scss.
MAT = {}


def build_materials():
    MAT["plinth"] = material("plinth", "#18212b", 0.62)
    MAT["plinth_top"] = material("plinth_top", "#212c38", 0.55)
    MAT["slate"] = material("slate", "#34414e", 0.5)
    MAT["ink"] = material("ink", "#0f161e", 0.35)
    MAT["ivory"] = material("ivory", "#ece6dc", 0.42)
    MAT["sage"] = material("sage", "#87b3aa", 0.5)
    MAT["copper"] = material("copper", "#db7b3c", 0.32, metallic=0.35)
    MAT["teal"] = material("teal", "#1fa694", 0.4)
    MAT["glow"] = material("glow", "#2bd4bd", 0.3, emission="#2bd4bd", strength=3.0)
    MAT["ember"] = material("ember", "#e8853f", 0.3, emission="#e8853f", strength=1.1)


# --------------------------------------------------------------------------
# Geometry helpers
# --------------------------------------------------------------------------

def _select_only(obj):
    for other in bpy.context.selected_objects:
        other.select_set(False)
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj


def finish(obj, name, mat, bevel=0.0, segments=3, parent=None, smooth=True):
    obj.name = name
    obj.data.name = name
    _select_only(obj)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel > 0:
        mod = obj.modifiers.new("bevel", "BEVEL")
        mod.width = bevel
        mod.segments = segments
        mod.limit_method = "ANGLE"
        mod.angle_limit = math.radians(40)
        bpy.ops.object.modifier_apply(modifier=mod.name)
    if smooth:
        bpy.ops.object.shade_smooth_by_angle(angle=math.radians(46))
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    if parent is not None:
        obj.parent = parent
    return obj


def box(name, size, loc, mat, bevel=0.03, parent=None, rot=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.active_object
    obj.scale = size
    if rot:
        obj.rotation_euler = rot
    return finish(obj, name, mat, bevel=bevel, parent=parent)


def cyl(name, radius, depth, loc, mat, verts=32, bevel=0.02, parent=None, rot=None, base_origin=False):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=radius, depth=depth, location=loc)
    obj = bpy.context.active_object
    if base_origin:
        obj.data.transform(Matrix.Translation((0, 0, depth / 2)))
    if rot:
        obj.rotation_euler = rot
    return finish(obj, name, mat, bevel=bevel, parent=parent)


def sphere(name, radius, loc, mat, parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, radius=radius, location=loc)
    return _smooth(finish(bpy.context.active_object, name, mat, parent=parent, smooth=False))


def _smooth(obj):
    _select_only(obj)
    bpy.ops.object.shade_smooth()
    return obj


def tube(name, start, end, radius, mat, parent=None, verts=12):
    """A cylinder whose origin sits at `start`, so scaling Z grows it toward `end`."""
    start, end = Vector(start), Vector(end)
    direction = end - start
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=radius, depth=direction.length, location=start)
    obj = bpy.context.active_object
    obj.data.transform(Matrix.Translation((0, 0, direction.length / 2)))
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(direction.normalized())
    finish(obj, name, mat, parent=parent, smooth=False)
    return _smooth(obj)


def extruded(name, points, depth, loc, mat, parent=None, rot=None, scale=1.0, bevel=0.01):
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    verts = [bm.verts.new((x * scale, y * scale, 0)) for x, y in points]
    face = bm.faces.new(verts)
    geom = bmesh.ops.extrude_face_region(bm, geom=[face])
    for v in geom["geom"]:
        if isinstance(v, bmesh.types.BMVert):
            v.co.z += depth
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    if rot:
        obj.rotation_euler = rot
    return finish(obj, name, mat, bevel=bevel, segments=2, parent=parent)


def curve_tube(name, points, radius, mat, parent=None, cyclic=True):
    data = bpy.data.curves.new(name, "CURVE")
    data.dimensions = "3D"
    data.bevel_depth = radius
    data.bevel_resolution = 4
    spline = data.splines.new("NURBS")
    spline.points.add(len(points) - 1)
    for point, co in zip(spline.points, points):
        point.co = (*co, 1)
    spline.use_cyclic_u = cyclic
    spline.use_endpoint_u = not cyclic
    spline.order_u = 4
    spline.resolution_u = 6
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    _select_only(obj)
    bpy.ops.object.convert(target="MESH")
    return _smooth(finish(bpy.context.active_object, name, mat, parent=parent, smooth=False))


def join(name, objs, mat=None):
    for other in bpy.context.selected_objects:
        other.select_set(False)
    for obj in objs:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    obj = bpy.context.active_object
    obj.name = name
    obj.data.name = name
    if mat:
        obj.data.materials.clear()
        obj.data.materials.append(mat)
    return obj


def empty(name, loc=(0, 0, 0), parent=None, rot=None):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    if rot:
        obj.rotation_euler = rot
    obj.parent = parent
    return obj


# --------------------------------------------------------------------------
# Animation helpers. One action per role; every object of a role gets its
# own slot in that action, so the glTF exporter emits a single clip per role.
# --------------------------------------------------------------------------

class Choreo:
    def __init__(self, role):
        self.action = bpy.data.actions.new(role)
        self.end = 0

    def _bind(self, obj):
        if obj.animation_data is None:
            obj.animation_data_create()
        if obj.animation_data.action is None:
            obj.animation_data.action = self.action

    def _key(self, obj, path, frames):
        self._bind(obj)
        for frame, value in frames:
            setattr(obj, path, value)
            obj.keyframe_insert(path, frame=frame)
        self.end = max(self.end, max(f for f, _ in frames))

    def pop(self, obj, start, dur=10, overshoot=1.12):
        """Scale up from nothing with a little overshoot."""
        full = obj.scale.copy()
        tiny = Vector((TINY, TINY, TINY))
        frames = [(0, tiny)] if start > 0 else []
        frames += [(start, tiny), (start + round(dur * 0.65), full * overshoot), (start + dur, full)]
        self._key(obj, "scale", frames)

    def drop(self, obj, start, height=1.4, dur=12):
        """Appear above the resting spot and land with a small settle."""
        rest = obj.location.copy()
        up = rest + Vector((0, 0, height))
        full = obj.scale.copy()
        tiny = Vector((TINY, TINY, TINY))
        land = start + round(dur * 0.72)
        self._key(obj, "location", [(0, up), (start, up), (land, rest - Vector((0, 0, 0.035))), (start + dur, rest)])
        self._key(obj, "scale", ([(0, tiny)] if start > 1 else []) + [(max(start - 1, 0), tiny), (start + 2, full)])

    def slide(self, obj, start, offset, dur=10):
        """Slide in from `offset` (local units), hidden until it starts moving."""
        rest = obj.location.copy()
        origin = rest + Vector(offset)
        full = obj.scale.copy()
        tiny = Vector((TINY, TINY, TINY))
        self._key(obj, "location", [(0, origin), (start, origin), (start + dur, rest)])
        self._key(obj, "scale", ([(0, tiny)] if start > 1 else []) + [(max(start - 1, 0), tiny), (start + 1, full)])

    def grow(self, obj, start, dur=10):
        """Extend along local Z from the origin (pairs with tube())."""
        full = obj.scale.copy()
        flat = Vector((full.x, full.y, TINY))
        hidden = Vector((TINY, TINY, TINY))
        frames = [(0, hidden)] if start > 1 else []
        frames += [(max(start - 1, 0), hidden), (start, flat), (start + dur, full)]
        self._key(obj, "scale", frames)


def idle_spin(obj, speed=0.6):
    obj["idle"] = "spin"
    obj["idle_speed"] = speed


# --------------------------------------------------------------------------
# Shared plinth
# --------------------------------------------------------------------------

def build_plinth():
    root = empty("plinth")
    box("plinth_base", (3.5, 3.5, 0.22), (0, 0, -0.43), MAT["plinth"], bevel=0.09, parent=root)
    box("plinth_seam", (3.32, 3.32, 0.05), (0, 0, -0.3), MAT["glow"], bevel=0.04, parent=root)
    box("plinth_top", (3.2, 3.2, 0.28), (0, 0, -0.14), MAT["plinth_top"], bevel=0.08, parent=root)
    # Engraved grid on the deck so an empty plinth between roles still reads.
    for i in (-1, 0, 1):
        box(f"plinth_rule_x{i + 1}", (2.9, 0.012, 0.006), (0, i * 0.95, 0.002), MAT["slate"], bevel=0, parent=root)
        box(f"plinth_rule_y{i + 1}", (0.012, 2.9, 0.006), (i * 0.95, 0, 0.002), MAT["slate"], bevel=0, parent=root)
    return root


# --------------------------------------------------------------------------
# Roles
# --------------------------------------------------------------------------

def role_hero():
    """Full stack: idea at the top travels down through UI, API and data."""
    root = empty("role_hero")
    c = Choreo("hero")

    data = box("hero_layer_data", (2.1, 2.1, 0.14), (0, 0, 0.32), MAT["slate"], bevel=0.05, parent=root)
    api = box("hero_layer_api", (2.1, 2.1, 0.14), (0, 0, 0.98), MAT["slate"], bevel=0.05, parent=root)
    ui = box("hero_layer_ui", (2.1, 2.1, 0.14), (0, 0, 1.64), MAT["ivory"], bevel=0.05, parent=root)
    c.drop(data, 0)
    c.drop(api, 12)
    c.drop(ui, 24)

    # Data: two database drums.
    for i, (x, y) in enumerate(((-0.45, -0.35), (0.4, -0.45))):
        drum = cyl(f"hero_db_{i}", 0.26, 0.34, (x, y, 0.39), MAT["copper"], bevel=0.03, parent=root, base_origin=True)
        c.pop(drum, 8 + i * 4)
    # API: three services.
    for i, x in enumerate((-0.55, 0.0, 0.55)):
        svc = box(f"hero_service_{i}", (0.34, 0.34, 0.34), (x, -0.35, 1.22), MAT["ivory"], bevel=0.06, parent=root)
        c.pop(svc, 20 + i * 3)
    # UI: nav bar and two tiles laid on the top slab.
    nav = box("hero_ui_nav", (1.6, 0.18, 0.05), (0, 0.55, 1.735), MAT["teal"], bevel=0.02, parent=root)
    c.pop(nav, 32)
    for i, x in enumerate((-0.42, 0.42)):
        tile = box(f"hero_ui_tile_{i}", (0.7, 0.62, 0.06), (x, -0.2, 1.74), MAT["slate"], bevel=0.03, parent=root)
        c.pop(tile, 35 + i * 3)

    beam = tube("hero_beam", (-0.82, -0.82, 0.08), (-0.82, -0.82, 1.9), 0.05, MAT["glow"], parent=root)
    c.grow(beam, 42, dur=14)

    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.22, location=(-0.82, -0.82, 2.22))
    idea = finish(bpy.context.active_object, "hero_idea", MAT["ember"], smooth=False, parent=root)
    idle_spin(idea, 0.9)
    c.pop(idea, 54, dur=12, overshoot=1.3)
    return root, c


def role_backend():
    """Systems built to last: a server rack, a database and a steady link."""
    root = empty("role_backend")
    c = Choreo("backend")

    rack = box("be_rack", (0.95, 0.8, 1.9), (-0.5, 0.25, 0.95), MAT["slate"], bevel=0.05, parent=root)
    c.drop(rack, 0, height=1.6)
    for i in range(6):
        z = 0.32 + i * 0.27
        blade = box(f"be_blade_{i}", (0.8, 0.1, 0.2), (-0.5, -0.17, z), MAT["ivory"], bevel=0.025, parent=root)
        c.slide(blade, 10 + i * 3, (0, 0.5, 0), dur=8)
        led = box(f"be_led_{i}", (0.07, 0.03, 0.05), (-0.22, -0.225, z), MAT["glow"], bevel=0.01, parent=root)
        c.pop(led, 18 + i * 3, dur=6)

    for i in range(3):
        disc = cyl(f"be_db_{i}", 0.42, 0.24, (0.72, -0.35, 0.02 + i * 0.3), MAT["ivory"] if i % 2 else MAT["copper"],
                   bevel=0.04, parent=root, base_origin=True)
        c.drop(disc, 30 + i * 5, height=1.0, dur=10)
        if i < 2:
            ring = cyl(f"be_db_ring_{i}", 0.425, 0.04, (0.72, -0.35, 0.27 + i * 0.3), MAT["glow"], bevel=0.0,
                       parent=root, base_origin=True)
            c.pop(ring, 40 + i * 3, dur=6)

    cable = curve_tube("be_cable", [(-0.02, 0.0, 0.5), (0.15, -0.1, 0.12), (0.4, -0.3, 0.08), (0.5, -0.35, 0.3)],
                       0.035, MAT["glow"], parent=root, cyclic=False)
    c.pop(cable, 50, dur=8)

    badge = cyl("be_api_badge", 0.26, 0.08, (0.72, -0.35, 1.32), MAT["teal"], verts=6, bevel=0.02, parent=root,
                rot=(math.radians(90), 0, math.radians(45)))
    idle_spin(badge, 0.7)
    c.pop(badge, 56, dur=12, overshoot=1.25)
    return root, c


def role_frontend():
    """Interfaces that feel clear: a desktop window, a phone and a cursor."""
    root = empty("role_frontend")
    c = Choreo("frontend")
    facing = (0, 0, math.radians(38))

    window = empty("fe_window", (-0.3, 0.35, 0), parent=root, rot=facing)
    window.scale = (1.3, 1.3, 1.3)
    stand = cyl("fe_stand_foot", 0.38, 0.06, (0, 0, 0.0), MAT["slate"], bevel=0.02, parent=window, base_origin=True)
    neck = box("fe_stand_neck", (0.12, 0.12, 0.4), (0, 0.06, 0.24), MAT["slate"], bevel=0.02, parent=window)
    c.pop(stand, 0, dur=8)
    c.pop(neck, 3, dur=8)

    frame = box("fe_frame", (2.1, 0.1, 1.36), (0, 0, 1.12), MAT["ivory"], bevel=0.05, parent=window)
    c.pop(frame, 6, dur=12, overshoot=1.06)
    screen = box("fe_screen", (1.94, 0.02, 1.08), (0, -0.055, 1.07), MAT["ink"], bevel=0.0, parent=window)
    c.pop(screen, 12, dur=8)
    for i, color in enumerate(("copper", "sage", "teal")):
        dot = cyl(f"fe_dot_{i}", 0.035, 0.02, (-0.88 + i * 0.1, -0.06, 1.71), MAT[color], verts=16, bevel=0,
                  parent=window, rot=(math.radians(90), 0, 0))
        c.pop(dot, 16 + i * 2, dur=6)

    hero = box("fe_ui_hero", (1.7, 0.03, 0.34), (0, -0.07, 1.38), MAT["teal"], bevel=0.015, parent=window)
    c.pop(hero, 22, dur=9)
    for i, x in enumerate((-0.58, 0.0, 0.58)):
        card = box(f"fe_ui_card_{i}", (0.5, 0.03, 0.42), (x, -0.07, 0.88), MAT["slate"], bevel=0.015, parent=window)
        c.pop(card, 28 + i * 3, dur=8)
        line = box(f"fe_ui_line_{i}", (0.34, 0.035, 0.04), (x, -0.075, 0.98), MAT["ivory"], bevel=0, parent=window)
        c.pop(line, 31 + i * 3, dur=6)

    phone = empty("fe_phone", (1.0, -0.75, 0), parent=root, rot=(0, 0, math.radians(38)))
    phone.scale = (1.2, 1.2, 1.2)
    body = box("fe_phone_body", (0.5, 0.07, 0.96), (0, 0, 0.48), MAT["slate"], bevel=0.06, parent=phone)
    c.drop(body, 38, height=1.0, dur=12)
    pscreen = box("fe_phone_screen", (0.42, 0.02, 0.84), (0, -0.04, 0.49), MAT["ink"], bevel=0, parent=phone)
    c.pop(pscreen, 46, dur=6)
    for i in range(3):
        row = box(f"fe_phone_row_{i}", (0.32, 0.025, 0.16), (0, -0.055, 0.76 - i * 0.24),
                  MAT["teal"] if i == 0 else MAT["ivory"], bevel=0.01, parent=phone)
        c.pop(row, 49 + i * 3, dur=6)

    arrow = [(0, 0), (0, -1.0), (0.27, -0.76), (0.45, -1.14), (0.6, -1.07), (0.42, -0.7), (0.74, -0.7)]
    cursor = extruded("fe_cursor", arrow, 0.08, (0.2, -1.0, 1.75), MAT["copper"], parent=root, scale=0.42,
                      rot=(math.radians(90), 0, math.radians(35)))
    c.pop(cursor, 58, dur=10, overshoot=1.3)
    return root, c


def role_ml():
    """Practical automation: a network thinking above the chip it runs on."""
    root = empty("role_ml")
    c = Choreo("ml")

    chip = box("ml_chip", (1.15, 1.15, 0.16), (0, 0, 0.1), MAT["ink"], bevel=0.03, parent=root)
    c.drop(chip, 0, height=0.8, dur=10)
    pins = []
    for side in range(4):
        for i in range(5):
            t = -0.4 + i * 0.2
            x, y = [(t, 0.66), (t, -0.66), (0.66, t), (-0.66, t)][side]
            size = (0.07, 0.18, 0.04) if side < 2 else (0.18, 0.07, 0.04)
            pins.append(box(f"ml_pin_{side}_{i}", size, (x, y, 0.06), MAT["copper"], bevel=0.008))
    pin_ring = join("ml_pins", pins, MAT["copper"])
    pin_ring.parent = root
    c.pop(pin_ring, 6, dur=8)
    core = box("ml_core", (0.55, 0.55, 0.05), (0, 0, 0.2), MAT["glow"], bevel=0.02, parent=root)
    c.pop(core, 10, dur=8)

    net = empty("ml_net", (0, 0, 1.25), parent=root, rot=(0, 0, math.radians(45)))
    layers = [[-0.45, 0.0, 0.45], [-0.66, -0.22, 0.22, 0.66], [-0.24, 0.24]]
    xs = [-0.95, 0.0, 0.95]
    mats = [MAT["ivory"], MAT["copper"], MAT["glow"]]
    nodes = []
    start = 16
    for li, (x, zs) in enumerate(zip(xs, layers)):
        row = []
        for ni, z in enumerate(zs):
            node = sphere(f"ml_node_{li}_{ni}", 0.13 if li != 1 else 0.11, (x, 0, z), mats[li], parent=net)
            c.pop(node, start + li * 14 + ni * 2, dur=8, overshoot=1.3)
            row.append((node, Vector((x, 0, z))))
        nodes.append(row)
    for li in range(2):
        for ai, (_, a) in enumerate(nodes[li]):
            for bi, (_, b) in enumerate(nodes[li + 1]):
                link = tube(f"ml_link_{li}_{ai}_{bi}", a, b, 0.012, MAT["sage"], parent=net, verts=8)
                c.grow(link, start + li * 14 + 6 + ai + bi, dur=8)

    stem = tube("ml_stem", (0, 0, 0.22), (0, 0, 0.6), 0.03, MAT["glow"], parent=root)
    c.grow(stem, 14, dur=6)

    bpy.ops.mesh.primitive_torus_add(major_radius=1.15, minor_radius=0.012, major_segments=96,
                                             minor_segments=8, location=(0, 0, 1.25))
    orbit = _smooth(finish(bpy.context.active_object, "ml_orbit", MAT["sage"], smooth=False, parent=root))
    orbit.rotation_euler = (math.radians(68), 0, math.radians(-30))
    idle_spin(orbit, 0.5)
    c.pop(orbit, 50, dur=12)
    agent = sphere("ml_agent", 0.09, (1.15, 0, 0), MAT["ember"], parent=orbit)
    c.pop(agent, 58, dur=8, overshoot=1.5)
    return root, c


def role_devops():
    """Ready to run: containers stacked by a pipeline that never stops."""
    root = empty("role_devops")
    c = Choreo("devops")

    def container(name, loc, mat, start):
        parts = [box(f"{name}_shell", (1.0, 0.46, 0.42), loc, mat, bevel=0.025)]
        for i in range(7):
            x = loc[0] - 0.39 + i * 0.13
            parts.append(box(f"{name}_rib_{i}", (0.04, 0.48, 0.36), (x, loc[1], loc[2]), mat, bevel=0.01))
        obj = join(name, parts, mat)
        obj.parent = root
        c.drop(obj, start, height=1.3, dur=11)
        return obj

    stack = [
        ("dv_box_0", (-0.75, 0.4, 0.21), MAT["copper"]),
        ("dv_box_1", (-0.75, -0.15, 0.21), MAT["teal"]),
        ("dv_box_2", (-0.75, 0.4, 0.64), MAT["ivory"]),
        ("dv_box_3", (-0.75, -0.15, 0.64), MAT["sage"]),
        ("dv_box_4", (-0.75, 0.13, 1.07), MAT["copper"]),
    ]
    for i, (name, loc, mat) in enumerate(stack):
        container(name, loc, mat, i * 7)

    # Lemniscate of Bernoulli standing upright: build -> ship -> observe -> ...
    points = []
    for i in range(16):
        t = 2 * math.pi * i / 16
        d = 1 + math.sin(t) ** 2
        points.append((0.62 * math.cos(t) / d, 0, 0.62 * math.sin(t) * math.cos(t) / d))
    loop_root = empty("dv_loop", (0.85, 0.6, 1.0), parent=root, rot=(0, 0, math.radians(45)))
    loop = curve_tube("dv_loop_tube", points, 0.045, MAT["glow"], parent=loop_root)
    c.pop(loop, 36, dur=12)
    post = box("dv_loop_post", (0.08, 0.08, 0.84), (0.85, 0.6, 0.42), MAT["slate"], bevel=0.02, parent=root)
    c.pop(post, 32, dur=8)

    teeth = [cyl("dv_gear_hub", 0.26, 0.1, (0, 0, 0), MAT["ivory"], verts=40, bevel=0.015)]
    for i in range(10):
        a = 2 * math.pi * i / 10
        teeth.append(box(f"dv_gear_tooth_{i}", (0.1, 0.1, 0.1), (math.cos(a) * 0.3, math.sin(a) * 0.3, 0),
                         MAT["ivory"], bevel=0.01, rot=(0, 0, a)))
    gear = join("dv_gear", teeth, MAT["ivory"])
    hole = cyl("dv_gear_axle", 0.08, 0.14, (0, 0, 0), MAT["copper"], verts=24, bevel=0.01)
    hole.parent = gear
    gear.location = (0.7, -0.75, 0.42)
    gear.rotation_euler = (math.radians(90), 0, math.radians(45))
    gear.parent = root
    idle_spin(gear, 0.8)
    c.pop(gear, 48, dur=10, overshoot=1.2)

    beacon_mast = box("dv_mast", (0.05, 0.05, 0.5), (-0.75, 0.13, 1.53), MAT["slate"], bevel=0.01, parent=root)
    c.pop(beacon_mast, 54, dur=6)
    beacon = sphere("dv_beacon", 0.1, (-0.75, 0.13, 1.82), MAT["glow"], parent=root)
    c.pop(beacon, 60, dur=10, overshoot=1.5)
    return root, c


# --------------------------------------------------------------------------
# Camera, lights, render
# --------------------------------------------------------------------------

def build_camera():
    data = bpy.data.cameras.new("HeroCamera")
    data.lens = 60
    data.sensor_width = 36
    cam = bpy.data.objects.new("HeroCamera", data)
    bpy.context.collection.objects.link(cam)
    target = Vector((0, 0, 0.24))
    cam.location = target + Vector((1, -1, 0.78)).normalized() * 9.4
    cam.rotation_mode = "QUATERNION"
    cam.rotation_quaternion = (target - cam.location).to_track_quat("-Z", "Y")
    bpy.context.scene.camera = cam
    return cam


def build_lights():
    def area(name, loc, energy, color, size):
        data = bpy.data.lights.new(name, "AREA")
        data.energy = energy
        data.color = hex_rgba(color)[:3]
        data.size = size
        obj = bpy.data.objects.new(name, data)
        bpy.context.collection.objects.link(obj)
        obj.location = loc
        obj.rotation_mode = "QUATERNION"
        obj.rotation_quaternion = (Vector((0, 0, 0.6)) - Vector(loc)).to_track_quat("-Z", "Y")
        return obj

    lights = [
        area("key", (-3.5, -5.0, 6.5), 900, "#fff1dc", 4.0),
        area("fill", (6.0, -1.0, 2.5), 220, "#cfe3ff", 5.0),
        area("rim", (1.5, 6.0, 4.5), 650, "#5fe0cf", 3.0),
    ]
    world = bpy.data.worlds.new("hero_world")
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = hex_rgba("#1a2633")
    bg.inputs["Strength"].default_value = 0.9
    bpy.context.scene.world = world
    return lights


def configure_render():
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 96
    scene.cycles.use_denoising = True
    scene.render.film_transparent = True
    scene.render.resolution_x = 1200
    scene.render.resolution_y = 1200
    scene.render.fps = FPS
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        for backend in ("OPTIX", "CUDA", "HIP", "ONEAPI"):
            try:
                prefs.compute_device_type = backend
            except TypeError:
                continue
            prefs.get_devices()
            gpus = [d for d in prefs.devices if d.type != "CPU"]
            if gpus:
                for d in prefs.devices:
                    d.use = True
                scene.cycles.device = "GPU"
                print(f"[hero] rendering on {backend}: {', '.join(d.name for d in gpus)}")
                return
    except Exception as exc:  # GPU discovery is best-effort.
        print(f"[hero] GPU setup skipped: {exc}")
    print("[hero] rendering on CPU")


def set_role_visibility(roles, visible_id):
    for role_id, root in roles.items():
        hidden = role_id != visible_id
        for obj in [root, *root.children_recursive]:
            obj.hide_render = hidden


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", required=True)
    parser.add_argument("--posters", action="store_true")
    parser.add_argument("--blend")
    parser.add_argument("--only", choices=ROLES, help="render a single poster")
    args = parser.parse_args(argv)
    os.makedirs(args.out, exist_ok=True)

    bpy.ops.wm.read_factory_settings(use_empty=True)
    build_materials()
    configure_render()
    build_plinth()
    roles, end = {}, 0
    for builder in (role_hero, role_backend, role_frontend, role_ml, role_devops):
        root, choreo = builder()
        role_id = root.name.removeprefix("role_")
        roles[role_id] = root
        end = max(end, choreo.end)
        print(f"[hero] {role_id}: {len(root.children_recursive)} parts, {choreo.end / FPS:.2f}s")
    build_camera()
    build_lights()

    scene = bpy.context.scene
    scene.frame_start = 0
    scene.frame_end = end

    glb = os.path.join(args.out, "hero.glb")
    bpy.ops.export_scene.gltf(
        filepath=glb,
        export_format="GLB",
        export_apply=True,
        export_cameras=True,
        export_lights=False,
        export_extras=True,
        export_yup=True,
        export_animations=True,
        export_animation_mode="ACTIONS",
        export_force_sampling=True,
        export_frame_step=1,
        export_optimize_animation_size=True,
        export_materials="EXPORT",
        export_texcoords=False,  # untextured: UVs would only add weight
    )
    print(f"[hero] wrote {glb}")

    if args.blend:
        os.makedirs(os.path.dirname(args.blend), exist_ok=True)
        bpy.ops.wm.save_as_mainfile(filepath=args.blend, compress=True)
        print(f"[hero] saved {args.blend}")

    if args.posters:
        scene.frame_set(end)
        for role_id in ([args.only] if args.only else roles):
            set_role_visibility(roles, role_id)
            scene.render.filepath = os.path.join(args.out, f"poster-{role_id}.png")
            bpy.ops.render.render(write_still=True)
            print(f"[hero] rendered poster-{role_id}.png")


if __name__ == "__main__":
    main()
