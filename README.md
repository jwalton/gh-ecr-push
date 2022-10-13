# Push/Pull to Amazon ECR Action

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Push an image to, or pull an image from Amazon's Elastic Container Registry.

See also [Login to Amazon ECR Action](https://github.com/jwalton/gh-ecr-login).

## Setup

To set this up, create a new IAM user with access to ECR (e.g. with the
AmazonEC2ContainerRegistryPowerUser policy). Then, add the following secrets
to your GitHub project:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## Inputs

- `access-key-id` - Your IAM user's AWS access key ID.
- `secret-access-key` - Your IAM user's AWS secret key.
- `image` - The remote image to push or pull. e.g. "myimage:v1.2.0".  If you are pushing, this can be a list of images, separated by commas e.g. "myimage:v1.2.0, myimage:latest".
- `local-image` - The name of the local image to push (or to pull to).  If this is not specified, it will default to the same as `image`.  Note that if `image` is an array of images, this must be specified as this cannot be a list.
- `region` - The ECR region to upload to. Defaults to 'us-east-1'.
- `is-semver` - Specifies if the image follows the semantic versioning standard. It will push X, X.Y and X.Y.Z tags. Defaults to false.  Note that if this is true, the semver numbers come from the `local-image`.  If `image` is a list, the tags from each image will be discarded.

## Outputs

- `imageUrl` - The URL of the image that was pushed/pulled.  If multiple images were pushed, this will be the URL of the first image that was pushed.

## Login

Push an image to ECR:

```yaml
- run: docker build --tag my-image:v1 .
- name: Push to ECR
  id: ecr
  uses: jwalton/gh-ecr-push@v1
  with:
    access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    region: us-east-1
    image: my-image:v1
```

Push a "latest" tag:

```yaml
- run: docker build --tag my-image:v1 .
- name: Push to ECR
  id: ecr
  uses: jwalton/gh-ecr-push@v1
  with:
    access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    region: us-east-1
    local-image: my-image:v1
    image: my-image:v1, my-image:latest
```

Push the local image 'my-image' to ECR as 'my-image:dev-XXXXX':

```yaml
- run: docker build --tag my-image .
- name: Push to ECR
  id: ecr
  uses: jwalton/gh-ecr-push@v1
  with:
    access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    region: us-east-1
    local-image: my-image
    image: my-image:dev-${{ github.sha }}
```

Push an image to ECR (semver way):

```yaml
- run: docker build --tag my-image:v1 .
- name: Push to ECR
  id: ecr
  uses: jwalton/gh-ecr-push@v1
  with:
    access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    region: us-east-1
    image: my-image:1.2.3
    is-semver: true # will push my-image:1, my-image:1.2 and my-image:1.2.3
```

Pull an image from ECR:

```yaml
- name: Pull from ECR
  id: ecr
  uses: jwalton/gh-ecr-push@v1
  with:
    access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    region: us-east-1
    image: my-image:dev-${{ github.sha }}
    local-image: my-image
    direction: pull
```
