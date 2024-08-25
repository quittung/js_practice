import matplotlib.pyplot as plt

# Your data in decimal format
locations = [
    {"name": "The Wreck of the Anastasiya", "north": 46.2615, "west": -28.02017},
    {"name": "The Heavy Cannon at Fort William", "north": 46.2753, "west": -27.992},
    {"name": "The Lighthouse at Loveday Bay", "north": 46.25583, "west": -27.97483},
    {"name": "The Oil Storage Facility", "north": 46.282, "west": -28.02267},
    {"name": "Treasure of the Princess Zara wreck", "north": 46.31417, "west": -28.0615},
    {"name": "The Persian Tower", "north": 46.26617, "west": -27.97817},
    {"name": "The Mud Baths Ticket Booth", "north": 46.2465, "west": -28.01317},
    {"name": "The Shearwater Fire Dragon", "north": 46.36783, "west": -27.92333},
    {"name": "The Sunken Tower", "north": 46.2605, "west": -28.014},
    {"name": "Temple of False Hope", "north": 46.26367, "west": -27.98317},
    {"name": "Gold Shilling Falls", "north": 46.32467, "west": -28.0425},
    {"name": "A Blue Whale", "north": 46.2785, "west": -28.0035},
    {"name": "The Walls Lift Bridge", "north": 46.25233, "west": -27.998}
]

# Extract coordinates and names
north_coords = [loc['north'] for loc in locations]
west_coords = [loc['west'] for loc in locations]
names = [loc['name'] for loc in locations]

# Create the plot
plt.figure(figsize=(10, 10))  # Use square figure size
plt.scatter(west_coords, north_coords, color='red', s=100)

# Add labels for each point
for name, x, y in zip(names, west_coords, north_coords):
    plt.text(x, y, name, fontsize=9, ha='right', va='bottom')

# Set axis labels
plt.xlabel('West')
plt.ylabel('North')

# Set square aspect ratio
plt.gca().set_aspect('equal', adjustable='box')

# Optionally set limits (zoom in/out)
plt.xlim(min(west_coords) - 0.05, max(west_coords) + 0.05)
plt.ylim(min(north_coords) - 0.05, max(north_coords) + 0.05)

# Add grid for better visualization
plt.grid(True)

# Show plot
plt.title("Game World Coordinates Plot (Square Aspect Ratio)")
plt.show()
