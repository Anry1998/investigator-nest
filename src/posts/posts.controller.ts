import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { FileInterceptor } from '@nestjs/platform-express';

import * as path from 'path'

@Controller('posts')
export class PostsController {
    constructor(private postService: PostsService) {}

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    createPost(@Body()dto: CreatePostDto, 
                @UploadedFile() image) {

                    // const filePath = path.dirname
                    //.resolve(__dirname, '..', 'static')

        //   return image
        return this.postService.create(dto, image)
    }


    @Get('/get')
    // @UseInterceptors(FileInterceptor('image'))
    eee() {

        const filePath = path.resolve(__dirname, '..')

        return filePath 
        
    }
}

// C:\Users\PC\Desktop\nest-project\investigator\dist\posts
// C:\Users\PC\Desktop\nest-project\investigator\dist