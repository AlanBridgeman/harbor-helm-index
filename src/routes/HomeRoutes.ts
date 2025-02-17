import { Request, Response } from 'express';
import { Controller, GET, Page, BaseController } from '@BridgemanAccessible/ba-web-framework';

@Controller()
export class HomeRoutes extends BaseController {
    @Page('Home', 'index.ejs')
    @GET('/')
    async home(req: Request, res: Response) {}
}