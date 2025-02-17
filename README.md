# Harbor Helm Index
The Harbor Helm Index software was designed for one very specific purpose. To expose Helm charts hosted in Harbor as if it was a Helm native repository. More specifically, to be able to use an easier to remember human oriented name for charts rather than a URI.

## Getting Started
There are a few different ways you can run the software
- [using Helm (**Recommended**)](#helm-chart)
- [using Docker](#docker)
- [using Node](#node)

### Helm Chart
As you might imagine for a tool that is intended to work with Helm the easiest way to deploy it is to use helm (yes, by doing this, you would be making use of this software)

```console
helm repo add BridgemanAccessible https://helm.bridgemanaccessible.ca/
helm install my-helm-index BridgemanAccessibe/harbor-helm-index
```

### Docker
You could deploy the docker container locally. However, this would involve being a lot more explicit about environment variables.

```console
docker run --name my-helm-index \
  --env NODE_ENV=development \
  --env PORT=8080 \
  --env COMPANY="My Company" \
  --env WEBSITE_TITLE_SUFFIX=" - My Company Helm Repo" \
  --env HOSTNAME="helm.exmaple.com" \
  --env DB_HOST="postgres.db.example.com" \
  --env DB_NAME=harbor_helm_index \
  --env DB_PASSWORD="Pa55w0rd!" \
  --env DB_PORT=5432 \
  --env DB_USER=helm_index \
  --env CACHE_HOSTNAME="redis.example.com" \
  --env CACHE_PORT=6379 \
  --env CACHE_PASSWORD="Pa55w0rd!" \
  harbor-helm-image
```

### Node
You could run it with Node by running `yarn start`. However, similar to Docker you would need to figure out a way to inject the needed environment variables.

## How It Works
There are two primary parts to how the software works.

The [Harbor](https://goharbor.io) part which involves receiving information about Helm charts as their uploaded or deleted from the registry.

The [Helm](https://helm.sh) part which involves exposing a specific `index.yaml` file for the Helm CLI to consume.

The following subsections will go into this in more details

### Harbor Webhooks
Luckily, Harbor offers us an easy and efficient way to have an event driven architecture as it relates to getting information about uploaded and deleted charts. More specifically, this is done through the use of webhooks which allows Harbor to send a notifying request to an endpoint exposed by this software.

The endpoint configured is `/harbor`.

### Helm's `index.yaml`
Helm's `repo` commands requires that the repository exposes a `index.yaml` file at it's root about the available charts. This is generated automatically by this software.