import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Res,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imagesDto } from 'src/images/images.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';

export const storge = {
  storage: diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      const filename: string =
        path?.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path?.parse(file?.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('images')
export class ImagesController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storge))
  uploadFile(
    @Body() body: imagesDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    return { imagePath: file.path };
  }

  @Get(':imagename')
  findImage(@Param('imagename') imagename, @Res() res): Promise<Object> {
    console.log(imagename);
    return res.sendFile(join(process.cwd(), 'uploads/' + imagename));
  }

  @Delete(':imagename')
  async getHello(@Param('imagename') imagename: string): Promise<any> {
    const pathToFile = join(process.cwd(), 'uploads/' + imagename);
    try {
      fs.unlinkSync(pathToFile);
      return { msg: 'Successfully deleted the file.' };
    } catch (err) {
      console.log(err.message);
      return { error: err.message };
    }
  }
}
