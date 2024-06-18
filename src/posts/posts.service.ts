import { Injectable} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class PostsService {

    constructor(@InjectModel(Post) private postRepositiry: typeof Post,
                private filesService: FilesService) {}

    async create(dto: CreatePostDto, image: any) {
        const fileName = await this.filesService.createFile(image)
        // Разворачиваем дто, поле image  - перезаписываем
        const post = await this.postRepositiry.create({...dto, image: fileName})
        return post
    }
}
