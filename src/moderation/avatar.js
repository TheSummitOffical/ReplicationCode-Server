
import { Jimp } from "jimp";


export async function moderateAvatar(buffer)
{
  const MAX_SIZE =
    20 * 1024 * 1024;


  if (buffer.length > MAX_SIZE)
  {
    return {
      allowed:false,
      reason:"Avatar exceeds 20MB limit"
    };
  }


  try
  {
    const image =
      await Jimp.read(buffer);


    if (
      image.bitmap.width < 64 ||
      image.bitmap.height < 64
    )
    {
      return {
        allowed:false,
        reason:"Image too small"
      };
    }


    if (
      image.bitmap.width > 8192 ||
      image.bitmap.height > 8192
    )
    {
      return {
        allowed:false,
        reason:"Image too large"
      };
    }


    return {
      allowed:true
    };

  }
  catch(err)
  {
    return {
      allowed:false,
      reason:"Image decode failed"
    };
  }
}


export async function processAvatar(buffer)
{
  const image =
    await Jimp.read(buffer);


  image.cover(
    512,
    512
  );


  // circular alpha mask
  for (
    let y = 0;
    y < 512;
    y++
  )
  {
    for (
      let x = 0;
      x < 512;
      x++
    )
    {
      const dx = x - 256;
      const dy = y - 256;

      if (
        Math.sqrt(dx*dx + dy*dy) > 256
      )
      {
        image.setPixelColor(
          0x00000000,
          x,
          y
        );
      }
    }
  }


  return await image.getBufferAsync(
    Jimp.MIME_PNG
  );
}
