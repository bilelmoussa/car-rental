import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { asyncWrapProviders } from 'async_hooks';

@Controller()
export class AppController {
        constructor(private readonly appService: AppService) { }

        @Get()
        getHello(): string {
                return this.appService.getHello();
        }

        @Get("/get_hello")
        postHello(): string {
                return 'fuck off';
        }

        @Get("/test_neovim")
        getTest(): string {
                return "testing neovim out!";
        }

        @Get("/help")
        getListof(): string {
                return "Heeealp me please!";
        }
}
