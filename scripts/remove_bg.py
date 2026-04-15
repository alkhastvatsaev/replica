from PIL import Image

def remove_background(path):
    img = Image.open(path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Si le pixel est presque blanc (seuil de tolérance car les images ont souvent des ombres très claires)
        if item[0:3] == (255, 255, 255) or (item[0] > 250 and item[1] > 250 and item[2] > 250):
            newData.append((255, 255, 255, 0)) # Rendre transparent
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(path, "PNG")

remove_background("/Users/alkhastvatsaev/Desktop/Cartier/images/love-ring.png")
remove_background("/Users/alkhastvatsaev/Desktop/Cartier/images/clou-ring.png")
