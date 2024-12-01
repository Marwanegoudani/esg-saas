from PIL import Image, ImageDraw, ImageFont
import os

def create_logo():
    # Create a new image with a white background
    width = 400
    height = 120
    image = Image.new('RGBA', (width, height), (255, 255, 255, 0))
    draw = ImageDraw.Draw(image)
    
    # Colors
    primary = (43, 75, 128)  # #2B4B80
    secondary = (75, 119, 185)  # #4B77B9
    
    # Draw the geometric logo
    box_size = 48
    box_x = 20
    box_y = (height - box_size) // 2
    
    # Draw outer hexagon
    points = [
        (box_x + 24, box_y),  # top
        (box_x + 44, box_y + 10),  # top right
        (box_x + 44, box_y + 30),  # bottom right
        (box_x + 24, box_y + 40),  # bottom
        (box_x + 4, box_y + 30),   # bottom left
        (box_x + 4, box_y + 10),   # top left
    ]
    draw.polygon(points, fill=primary, outline=secondary)
    
    # Draw top section in lighter color
    top_points = [
        (box_x + 24, box_y),      # top
        (box_x + 44, box_y + 10), # right
        (box_x + 24, box_y + 20), # bottom
        (box_x + 4, box_y + 10),  # left
    ]
    draw.polygon(top_points, fill=secondary, outline=primary)
    
    # Draw inner highlight
    inner_points = [
        (box_x + 24, box_y + 8),  # top
        (box_x + 34, box_y + 12), # right
        (box_x + 24, box_y + 20), # bottom
        (box_x + 14, box_y + 12), # left
    ]
    draw.polygon(inner_points, fill=(255, 255, 255, 153))  # white with 0.6 opacity
    
    # Add text
    try:
        font = ImageFont.truetype("arial.ttf", 36)
        font_light = ImageFont.truetype("arial.ttf", 36)
    except:
        font = ImageFont.load_default()
        font_light = ImageFont.load_default()
    
    # Draw text
    text_x = box_x + box_size + 20
    text_y = (height - 36) // 2
    
    draw.text((text_x, text_y), "Sustain", font=font, fill=primary)
    text_width = draw.textlength("Sustain", font=font)
    draw.text((text_x + text_width, text_y), ".ai", font=font_light, fill=secondary)
    
    # Ensure static directory exists
    static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static')
    os.makedirs(static_dir, exist_ok=True)
    
    # Save the image
    logo_path = os.path.join(static_dir, 'logo.png')
    image.save(logo_path, 'PNG')
    return logo_path

if __name__ == "__main__":
    create_logo() 