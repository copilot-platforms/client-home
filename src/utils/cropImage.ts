import { Area } from 'react-easy-crop'

export const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })
}

export interface FlipOptions {
  horizontal: boolean
  vertical: boolean
}

export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  flip: FlipOptions = { horizontal: false, vertical: false }
): Promise<Blob | null> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  const croppedCtx = canvas.getContext('2d')

  if (!croppedCtx) {
    return null
  }

  croppedCtx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
  croppedCtx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((file) => {
      resolve(file || null)
    }, 'image/jpeg')
  })
}
