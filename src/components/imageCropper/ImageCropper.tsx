'use client';

import getCroppedImg from '@/utils/cropImage';
import { Dialog, Slider } from '@mui/material';
import { FC, useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';

interface IImageCropper {
  open: boolean;
  image: string;
  getImage: (image: Blob) => void;
  onCancel: () => void;
}

const ImageCropper: FC<IImageCropper> = ({
  open,
  image,
  getImage,
  onCancel,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels as Area
      );
      if (!croppedImage) {
        console.error('Something went wrong while cropping the image!');
      }
      getImage(croppedImage as Blob);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open}>
      <div className='py-3 px-4'>
        <p className='font-medium'>Crop Image</p>
      </div>
      <div className='relative w-100 h-96'>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={4}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className='w-11/12 m-auto py-4'>
        <Slider
          min={1}
          max={5}
          step={0.1}
          aria-labelledby='Zoom'
          size='small'
          onChange={(_: Event, zoom: number | number[]) =>
            setZoom(zoom as number)
          }
        />
      </div>

      <hr />

      <div
        onClick={onCancel}
        className='w-11/12 m-auto flex flex-row justify-end gap-6 py-4'
      >
        <button className='py-1 px-3 text-new-dark rounded text-[13px] rounded bg-white border border-slate-300'>
          Cancel
        </button>
        <button
          onClick={showCroppedImage}
          className='bg-new-dark py-1 px-3 text-white text-[13px] rounded'
        >
          Save
        </button>
      </div>
    </Dialog>
  );
};

export default ImageCropper;
