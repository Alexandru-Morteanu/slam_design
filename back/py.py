import cv2
import numpy as np
from stl import mesh
import base64
import numpy as np
import io
from PIL import Image
import sys

def capture_photo():
    # Initialize the webcam
    cap = cv2.VideoCapture(2)

    # Check if the webcam opened correctly
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return None

    # Capture a frame
    ret, frame = cap.read()
    cap.release()

    if not ret:
        print("Error: Could not capture photo.")
        return None

    return frame

def black_white(img, threshold1v=20, threshold2v=60, iterations=1):
    print("Processing image...")
    # Convert to grayscale
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Create binary mask for solid black regions (adjust threshold as needed)
    _, black_regions = cv2.threshold(img_gray, 30, 255, cv2.THRESH_BINARY_INV)
    
    # Blur the image for edge detection
    img_blur = cv2.GaussianBlur(img_gray, (3, 3), 0.05)
    
    # Canny Edge Detection
    edges = cv2.Canny(image=img_blur, threshold1=threshold1v, threshold2=threshold2v)
    
    # Combine edges with black regions
    combined = cv2.bitwise_or(edges, black_regions)
    
    # Apply dilation to thicken the lines and eliminate gaps
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    thick_edges = cv2.dilate(combined, kernel, iterations=iterations)
    
    # Show the result
    #cv2.imshow('Thick Edges', thick_edges)
    #cv2.waitKey(0)
    
    return thick_edges

def edges_to_stl(edges, max_height=5, square_size=1, output_file="edges_output.stl"):
    # Normalize the height dynamically based on the matrix
    rows, cols = edges.shape
    max_value = np.max(edges)
    if max_value == 0:
        max_value = 1  # Prevent division by zero

    vertices = []
    faces = []

    for i in range(rows):
        for j in range(cols):
            if edges[i, j] > 0:  # Only process edge areas
                # Dynamic height proportional to edge intensity
                height = (edges[i, j] / max_value) * max_height

                # Define vertices for the square with adjusted height
                v0 = [j * square_size, i * square_size, 0]
                v1 = [(j + 1) * square_size, i * square_size, 0]
                v2 = [(j + 1) * square_size, (i + 1) * square_size, 0]
                v3 = [j * square_size, (i + 1) * square_size, 0]
                v4 = [j * square_size, i * square_size, height]
                v5 = [(j + 1) * square_size, i * square_size, height]
                v6 = [(j + 1) * square_size, (i + 1) * square_size, height]
                v7 = [j * square_size, (i + 1) * square_size, height]

                # Append vertices for the top surface
                vertices.extend([v4, v5, v6, v7])

                # Define two triangles for the top surface
                top_face_1 = [len(vertices) - 4, len(vertices) - 3, len(vertices) - 2]
                top_face_2 = [len(vertices) - 4, len(vertices) - 2, len(vertices) - 1]
                faces.extend([top_face_1, top_face_2])

    # Convert vertices and faces to numpy arrays
    vertices = np.array(vertices)
    faces = np.array(faces)

    # Create mesh
    object_mesh = mesh.Mesh(np.zeros(faces.shape[0], dtype=mesh.Mesh.dtype))
    for i, f in enumerate(faces):
        for j in range(3):
            object_mesh.vectors[i][j] = vertices[f[j], :]

    # Save to STL
    object_mesh.save(output_file)
    print(f"STL file saved as {output_file}")

def create_3d_from_2d_matrix(edge_matrix, base_thickness=1.0, extrude_height=5.0, square_size=1.0, output_3d_stl="extruded_3d_model.stl"):
    rows, cols = edge_matrix.shape
    vertices = []
    faces = []

    # Create the raised areas based on the black points in the edge matrix
    for i in range(rows):
        for j in range(cols):
            if edge_matrix[i, j] == 255:  # Black point detected (edge area)
                # Define the vertices for the extruded (raised) square
                base_z = base_thickness
                top_z = base_thickness + extrude_height

                v0 = [j * square_size, i * square_size, base_z]
                v1 = [(j + 1) * square_size, i * square_size, base_z]
                v2 = [(j + 1) * square_size, (i + 1) * square_size, base_z]
                v3 = [j * square_size, (i + 1) * square_size, base_z]
                v4 = [j * square_size, i * square_size, top_z]
                v5 = [(j + 1) * square_size, i * square_size, top_z]
                v6 = [(j + 1) * square_size, (i + 1) * square_size, top_z]
                v7 = [j * square_size, (i + 1) * square_size, top_z]

                # Add vertices for the extruded square
                raised_vert_indices = [len(vertices), len(vertices) + 1, len(vertices) + 2, len(vertices) + 3,
                                       len(vertices) + 4, len(vertices) + 5, len(vertices) + 6, len(vertices) + 7]
                vertices.extend([v0, v1, v2, v3, v4, v5, v6, v7])

                # Create faces for the extruded area
                # Bottom face (base layer surface) - Two triangles
                faces.append([raised_vert_indices[0], raised_vert_indices[1], raised_vert_indices[2]])  # Triangle 1
                faces.append([raised_vert_indices[0], raised_vert_indices[2], raised_vert_indices[3]])  # Triangle 2

                # Top face - Two triangles
                faces.append([raised_vert_indices[4], raised_vert_indices[5], raised_vert_indices[6]])  # Triangle 1
                faces.append([raised_vert_indices[4], raised_vert_indices[6], raised_vert_indices[7]])  # Triangle 2

                # Side faces - Each side will be divided into two triangles
                faces.append([raised_vert_indices[0], raised_vert_indices[1], raised_vert_indices[5]])  # Triangle 1
                faces.append([raised_vert_indices[0], raised_vert_indices[5], raised_vert_indices[4]])  # Triangle 2

                faces.append([raised_vert_indices[1], raised_vert_indices[2], raised_vert_indices[6]])  # Triangle 1
                faces.append([raised_vert_indices[1], raised_vert_indices[6], raised_vert_indices[5]])  # Triangle 2

                faces.append([raised_vert_indices[2], raised_vert_indices[3], raised_vert_indices[7]])  # Triangle 1
                faces.append([raised_vert_indices[2], raised_vert_indices[7], raised_vert_indices[6]])  # Triangle 2

                faces.append([raised_vert_indices[3], raised_vert_indices[0], raised_vert_indices[4]])  # Triangle 1
                faces.append([raised_vert_indices[3], raised_vert_indices[4], raised_vert_indices[7]])  # Triangle 2

    # Convert vertices and faces to numpy arrays for the STL mesh
    vertices = np.array(vertices)
    faces = np.array(faces)

    # Create the STL mesh
    extruded_mesh = mesh.Mesh(np.zeros(faces.shape[0], dtype=mesh.Mesh.dtype))
    for i, face in enumerate(faces):
        for j in range(3):
            extruded_mesh.vectors[i][j] = vertices[face[j], :]


    
    # Save the 3D STL model
    extruded_mesh.save(output_3d_stl)
    print(f"3D STL with extruded areas saved as {output_3d_stl}")

def downscale_image(image, target_width=400):
    # Get the current dimensions of the image
    height, width = image.shape[:2]
    
    # Check if the image width is greater than the target width
    if width > target_width:
        # Calculate the scaling factor while keeping the aspect ratio
        scale_ratio = target_width / width
        new_height = int(height * scale_ratio)
        
        # Resize the image
        downscaled_image = cv2.resize(image, (target_width, new_height), interpolation=cv2.INTER_AREA)
        return downscaled_image
    
    # If width is already 400 or less, return the original image
    return image

def main(image):
    image = downscale_image(image, 800)

    edges = black_white(image, 20, 60, 1) #20 60 for computer design
    edges_to_stl(edges, max_height=5, square_size=1, output_file="photo_edges_scaled.stl")
    edges = cv2.GaussianBlur(edges, (1, 1), 0.05) #for computer design
    print("BLURRED")
    #extrude_2d_stl_to_3d(input_2d_stl="photo_edges_scaled.stl", output_3d_stl="photo_edges_scaled_3d.stl", height=5.0)
    create_3d_from_2d_matrix(
    edge_matrix=edges,
    base_thickness=1.0,     # Set a custom base thickness
    extrude_height=20.0,    # Set a custom extrude height
    square_size=1,        # Set a custom square size for scaling
    output_3d_stl="photo_edges_scaled_3d.stl"
)

data_from_node = sys.stdin.read().strip()
received_array = list(map(int, data_from_node.split(',')))
img_bytes = bytearray(received_array)
img = Image.open(io.BytesIO(img_bytes))
frame = np.array(img)

main(frame)
