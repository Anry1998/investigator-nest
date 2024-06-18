import { forwardRef, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from './token.model';


@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  imports: [
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([Token]),
    JwtModule.register({}),
    
  ],
  exports: [
    AuthService,
    JwtModule,
  ]
})
export class AuthModule {}
