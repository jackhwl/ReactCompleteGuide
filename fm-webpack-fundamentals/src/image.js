const makeImage = (url, height, width) => {
    const image = document.createElement("img")
    image.height = height
    image.width = width
    image.src = url
    return image
}

export default makeImage