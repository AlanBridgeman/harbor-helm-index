import express, { Request, Response } from 'express';
import { v4 as newUUID } from 'uuid';
import { Controller, POST, BaseController } from '@BridgemanAccessible/ba-web-framework';

import { Chart } from '../entity/Chart';

type WebhookResponse = {
    type: 'PUSH_ARTIFACT' | 'DELETE_ARTIFACT',
    occur_at: number,
    operator: string,
    event_data: {
        resources: {
            digest: string,
            tag: string,
            resource_url: string
        }[],
        repository: {
            date_created?: number,
            name: string,
            namespace: string,
            repo_full_name: string,
            repo_type: string
        }
    }
};

@Controller()
export class HarborRoutes extends BaseController {
    @POST('/harbor', express.json())
    async webhook(req: Request, res: Response) {
        const response: WebhookResponse = req.body;
        if(response.type === 'PUSH_ARTIFACT') {
            console.log('Pushed a new Helm Chart');

            // Create a new database entry for the Helm Chart that got pushed
            await Chart.create({
                id: newUUID(),
                created: new Date(response.occur_at),
                user: response.operator,
                name: response.event_data.repository.name,
                digest: response.event_data.resources[0].digest,
                tag: response.event_data.resources[0].tag,
                url: response.event_data.resources[0].resource_url
            }).save();
        }
        else if(response.type === 'DELETE_ARTIFACT') {
            console.log('Deleted a Helm Chart');

            // Delete the Helm Chart from the database
            Chart.delete({ digest: response.event_data.resources[0].digest });
        }
        console.log(`Happened At: ${response.occur_at}`);
        console.log(`User (Operator): ${response.operator}`);
        console.log(`Name: ${response.event_data.repository.name}`);
        console.log(`Digest: ${response.event_data.resources[0].digest}`);
        console.log(`Tag: ${response.event_data.resources[0].tag}`);
        console.log(`URL: ${response.event_data.resources[0].resource_url}`);

        res.status(200).send('ok');
    }
}