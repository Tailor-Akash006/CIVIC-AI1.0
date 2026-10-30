import { 
  Controller, 
  Post, 
  Get, 
  Param, 
  Res, 
  UseInterceptors, 
  UploadedFile, 
  NotFoundException, 
  HttpStatus 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response } from 'express';
import * as fs from 'fs';
import { UploadsService } from './uploads.service';

const uploadStorage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const randomName = Array(16)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${Date.now()}-${randomName}${extname(file.originalname)}`);
  },
});

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: uploadStorage }))
  @ApiOperation({ summary: 'Upload photographic evidence for civic complaints (JPG/PNG, max 10MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    this.uploadsService.validateFile(file);
    const url = this.uploadsService.getFileUrl(file.filename);
    return {
      success: true,
      filename: file.filename,
      url,
      originalName: file.originalname,
      size: file.size,
    };
  }

  @Get(':filename')
  @ApiOperation({ summary: 'Serve uploaded complaint evidence photo' })
  serveFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', filename);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Requested image was not found');
    }
    return res.sendFile(filePath);
  }
}
