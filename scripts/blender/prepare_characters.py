"""Adapt the supplied characters without changing their original master files.

Run in Blender: exec(compile(open(SCRIPT_PATH, encoding='utf-8-sig').read(), SCRIPT_PATH, 'exec'))
ROOT is inferred from this script's location when __file__ is set.
"""
import bpy
import math
import os
from pathlib import Path
from mathutils import Vector

ROOT = Path(globals().get('PROJECT_ROOT', Path(__file__).resolve().parents[2]))
OUT = ROOT / 'public/models/characters'
OUT.mkdir(parents=True, exist_ok=True)
SOURCE = ROOT / 'art/characters'
STAGING = ROOT / '.qa/characters'
STAGING.mkdir(parents=True, exist_ok=True)


def belongs(obj, rig):
    parent = obj
    while parent:
        if parent == rig:
            return True
        parent = parent.parent
    return any(mod.type == 'ARMATURE' and mod.object == rig for mod in obj.modifiers)


def material(name, color):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    node = next(n for n in mat.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    node.inputs['Base Color'].default_value = (*color, 1)
    node.inputs['Roughness'].default_value = .65
    return mat


def garment(name, rings, mat, collection, rig, bone='pelvis'):
    vertices = []
    faces = []
    segments = 48
    for z, rx, ry in rings:
        for i in range(segments):
            angle = i * math.tau / segments
            pleat = 1 + .018 * math.cos(angle * 12)
            vertices.append((rx * math.cos(angle) * pleat, ry * math.sin(angle) * pleat, z))
    for j in range(len(rings) - 1):
        for i in range(segments):
            a = j * segments + i
            b = j * segments + (i + 1) % segments
            faces.append((a, b, b + segments, a + segments))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.materials.append(mat)
    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    obj.parent = rig
    group = obj.vertex_groups.new(name=bone)
    group.add(list(range(len(vertices))), 1, 'REPLACE')
    modifier = obj.modifiers.new('Garment skin', 'ARMATURE')
    modifier.object = rig
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    return obj


def adapt(kind):
    source_name = 'mid-autumn-' + kind + '-source.blend'
    inspect_name = 'INSPECT_Male' if kind == 'male' else 'INSPECT_Female'
    collection = bpy.data.collections.get(inspect_name)
    if collection is None:
        with bpy.data.libraries.load(str(SOURCE / source_name), link=False) as (source, target):
            target.objects = source.objects
        collection = bpy.data.collections.new(inspect_name)
        bpy.context.scene.collection.children.link(collection)
        for obj in target.objects:
            if obj:
                collection.objects.link(obj)
    rig = next(obj for obj in collection.objects if obj.type == 'ARMATURE')
    rig.animation_data_clear()
    for pose in rig.pose.bones:
        pose.matrix_basis.identity()
        for constraint in list(pose.constraints):
            pose.constraints.remove(constraint)
    objects = [obj for obj in collection.objects if belongs(obj, rig)]
    if rig.parent:
        objects.append(rig.parent)
    excluded = []
    for obj in objects:
        name = obj.name.lower()
        if any(word in name for word in ['patch pocket', 'shoulder bag', 'necklace', 'knee fraying', 'waistband stitching']):
            excluded.append(obj)
    objects = [obj for obj in objects if obj not in excluded]
    jade = material('Festival jade silk ' + kind, (.035, .19, .17))
    coral = material('Festival vermilion silk ' + kind, (.45, .065, .075))
    cream = material('Festival warm ivory ' + kind, (.82, .72, .49))
    gold = material('Festival gold trim ' + kind, (.65, .36, .10))
    for obj in objects:
        if obj.type != 'MESH':
            continue
        name = obj.name.lower()
        if kind == 'male' and any(word in name for word in ['cardigan', 'knit sleeve']):
            obj.data.materials.clear()
            obj.data.materials.append(jade)
        if kind == 'female' and any(word in name for word in ['grey top', 'short sleeve']):
            obj.data.materials.clear()
            obj.data.materials.append(coral)
        if 'trousers' in name or 'jeans' in name or 'ankle lining' in name:
            obj.data.materials.clear()
            obj.data.materials.append(cream)
        if kind == 'female' and 'jeans' in name:
            excluded.append(obj)
    objects = [obj for obj in objects if obj not in excluded]
    if kind == 'female':
        objects.append(garment('Festival pleated long skirt', [(.12,.31,.22),(.30,.29,.20),(.65,.23,.16),(.96,.16,.12),(1.04,.13,.105)], cream, collection, rig))
        objects.append(garment('Festival coral waist sash', [(.97,.165,.125),(1.035,.142,.112)], coral, collection, rig))
    else:
        objects.append(garment('Festival jade tunic hem', [(.72,.22,.16),(.9,.205,.16),(1.02,.204,.162)], jade, collection, rig))
        objects.append(garment('Festival gold waist belt', [(.995,.207,.166),(1.027,.207,.166)], gold, collection, rig))
    objects.append(garment('Festival standing collar ' + kind, [(1.432,.067,.062),(1.477,.063,.06)], jade if kind=='male' else coral, collection, rig, 'spine_03'))
    # Remap local hair textures; packed skin/eye images are retained.
    used_materials = {mat for obj in objects if obj.type=='MESH' for mat in obj.data.materials if mat}
    for mat in used_materials:
        if not mat.use_nodes:
            continue
        for node in mat.node_tree.nodes:
            if node.type != 'TEX_IMAGE' or node.image is None:
                continue
            image = node.image
            candidate = SOURCE / 'textures' / Path(image.filepath.replace('\\','/')).name
            if candidate.is_file():
                image.filepath = str(candidate)
                image.reload()
            if image.size[0] > 1024 or image.size[1] > 1024:
                factor = 1024 / max(image.size)
                image.scale(max(1,int(image.size[0]*factor)),max(1,int(image.size[1]*factor)))
            if image.has_data and not image.packed_file:
                image.pack()
    # Two arm IK chains baked into a standalone release clip.
    targets = []
    for side in ['l', 'r']:
        target = bpy.data.objects.new('Festival hand target ' + kind + side, None)
        collection.objects.link(target)
        constraint = rig.pose.bones['lowerarm_' + side].constraints.new('IK')
        constraint.target = target
        constraint.chain_count = 2
        constraint.use_tail = True
        targets.append((target, side))
    bpy.context.scene.render.fps = 30
    bpy.context.scene.frame_start = 1
    bpy.context.scene.frame_end = 181
    for frame, height, forward in [(1,1.22,-.30),(40,1.31,-.31),(90,1.57,-.31),(110,1.64,-.32),(135,1.45,-.27),(181,1.14,-.24)]:
        for target, side in targets:
            x = (.11 if side=='l' else -.11) + (.13 if kind=='male' else -.13)
            target.location = (x, forward, height)
            target.keyframe_insert(data_path='location', frame=frame)
    bpy.ops.object.select_all(action='DESELECT')
    rig.select_set(True)
    bpy.context.view_layer.objects.active = rig
    bpy.ops.nla.bake(frame_start=1,frame_end=181,step=2,only_selected=False,visual_keying=True,clear_constraints=True,use_current_action=False,bake_types={'POSE'})
    rig.animation_data.action.name = 'Lantern_Release_' + kind
    for obj in targets:
        bpy.data.objects.remove(obj[0], do_unlink=True)
    bpy.context.scene.frame_set(1)
    for obj in collection.objects:
        obj.hide_set(obj not in objects)
    bpy.ops.object.select_all(action='DESELECT')
    for obj in objects:
        obj.hide_set(False)
        obj.hide_viewport = False
        obj.hide_render = False
        obj.select_set(True)
    bpy.context.view_layer.objects.active = rig
    # Write only the character datablocks, preserving the imported masters.
    bpy.data.libraries.write(str(STAGING / ('festival-' + kind + '.blend')), set(objects), fake_user=True)
    bpy.ops.export_scene.gltf(filepath=str(OUT / ('festival-' + kind + '.glb')),use_selection=True,export_format='GLB',export_animations=True,export_animation_mode='ACTIVE_ACTIONS',export_force_sampling=True,export_frame_range=True,export_yup=True)
    print('EXPORTED',kind,len(objects),os.path.getsize(OUT / ('festival-' + kind + '.glb')))


adapt('male')
adapt('female')
