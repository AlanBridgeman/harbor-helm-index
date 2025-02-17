import { Request, Response } from 'express';
import { Controller, GET, BaseController } from '@BridgemanAccessible/ba-web-framework';
import { dump as writeYAML } from 'js-yaml';

import { Chart } from '../entity/Chart';

type HelmRepoIndexEntry = {
    apiVersion: 'v1',
    appVersion: `${string}.${string}.${string}`,
    dependencies: {
        name: string,
        repository: string,
        version: `${string}.${string}.${string}`
    }[],
    description: string,
    digest: string,
    home: string,
    name: string,
    sources: string[],
    urls: string[],
    version: `${string}.${string}.${string}`
};

type HelmRepoIndex = {
    apiVersion: 'v1',
    entries: {
        [key: string]: HelmRepoIndexEntry[]
    }
};

@Controller()
export class HelmRoutes extends BaseController {
    @GET('/index.yaml')
    private async index(req: Request, res: Response) {
        const index: HelmRepoIndex = {
            apiVersion: 'v1',
            entries: {}
        };

        // Get all Helm Charts from the database and add them to the index
        const charts = await Chart.find();
        charts.forEach(chart => {
            index.entries[chart.name] = [
                {
                    apiVersion: 'v1',
                    appVersion: '1.0.0',
                    dependencies: [],
                    description: chart.name,
                    digest: chart.digest,
                    home: `https://${process.env.HOSTNAME}/${chart.url.substring(chart.url.indexOf('/', chart.url.indexOf('/') + 1) + 1, chart.url.indexOf(':'))}`,
                    name: chart.name,
                    sources: [],
                    urls: [`oci://${chart.url}`],
                    version: chart.tag as `${string}.${string}.${string}`
                }
            ];
        })

        res.status(200)
            .setHeader('Content-Type', 'application/yaml') // Per IANA Media Types listing as noted in [RFC 9512](https://datatracker.ietf.org/doc/html/rfc9512)
            .send(writeYAML(index));
    }
}